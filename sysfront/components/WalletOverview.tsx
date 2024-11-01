"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, Send, Loader2 } from "lucide-react";
import { useWallet } from "@/lib/WalletContext";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import { useI18n } from '@/lib/i18n/I18nContext';
import * as echarts from 'echarts';
import 'echarts-gl';  // 需要安装并导入 echarts-gl
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdvisorDialog } from "./AdvisorDialog";
import { useTheme } from "next-themes";

interface AssetValue {
  symbol: string;
  value: number;
  color: string;
}

interface AdvisorSuggestion {
  advisorType: string;
  suggestion: string;
  loading: boolean;
}

function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  const midRatio = (startRatio + endRatio) / 2;
  const startRadian = startRatio * Math.PI * 2;
  const endRadian = endRatio * Math.PI * 2;
  const midRadian = midRatio * Math.PI * 2;

  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }

  k = 1;
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  const hoverRate = isHovered ? 1.05 : 1;

  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },
    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1;
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
    },
  };
}

function getPie3D(pieData: AssetValue[], internalDiameterRatio: number) {
  const series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  const k = typeof internalDiameterRatio !== "undefined" ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;

  pieData.forEach((data) => {
    sumValue += data.value;
  });

  // 生成3D饼图的series配置
  pieData.forEach((data, index) => {
    endValue = startValue + data.value;
    const startRatio = startValue / sumValue;
    const endRatio = endValue / sumValue;

    series.push({
      name: data.symbol,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false,
      },
      itemStyle: {
        color: data.color,
        opacity: 0.8,
      },
      parametricEquation: getParametricEquation(startRatio, endRatio, false, false, k, data.value),
    });

    startValue = endValue;
  });

  return {
    tooltip: {
      formatter: (params: any) => {
        if (!params.seriesName) return '';
        const asset = pieData.find(item => item.symbol === params.seriesName);
        if (!asset) return '';
        const percentage = ((asset.value / sumValue) * 100).toFixed(1);
        return `${params.seriesName}<br/>$${asset.value.toLocaleString()} (${percentage}%)`;
      }
    },
    legend: {
      orient: 'horizontal',
      top: '5%',
      left: 'center',
      data: pieData.map(item => item.symbol),
      textStyle: {
        fontSize: 14,
        lineHeight: 20,
        color: ({ theme }) => theme === 'dark' ? '#fff' : '#666'
      },
      itemGap: 16,
      itemWidth: 8,
      itemHeight: 8,
      formatter: (name) => {
        const asset = pieData.find(item => item.symbol === name);
        if (asset) {
          const percentage = ((asset.value / sumValue) * 100).toFixed(1);
          return `${name} ${percentage}%`;
        }
        return name;
      }
    },
    xAxis3D: {
      type: 'value',
      min: -1,
      max: 1,
    },
    yAxis3D: {
      type: 'value',
      min: -1,
      max: 1,
    },
    zAxis3D: {
      type: 'value',
      min: -1,
      max: 1,
    },
    grid3D: {
      show: false,
      boxHeight: 30,
      boxWidth: 100,
      boxDepth: 80,
      left: '10%',
      right: '45%',
      top: '10%',
      bottom: '10%',
      viewControl: {
        alpha: 40,
        beta: 40,
        distance: 300,
        rotateSensitivity: 0,
        zoomSensitivity: 0,
        panSensitivity: 0,
        autoRotate: true
      },
      environment: '#fff'
    },
    series: series,
  };
}

export function WalletOverview() {
  const { tokens, address } = useWallet();
  const [totalValue, setTotalValue] = useState(0);
  const [assetValues, setAssetValues] = useState<AssetValue[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [showList, setShowList] = useState(false);
  const [suggestions, setSuggestions] = useState<AdvisorSuggestion[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<AdvisorSuggestion | null>(null);
  const { theme } = useTheme();

  // 预定义的颜色数组，确保颜色一致性
  const CHART_COLORS = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#36A2EB',
  ];

  useEffect(() => {
    if (!tokens || tokens.length === 0) {
      setShowChart(false);
      return;
    }

    const sequence = async () => {
      const values = tokens.map((token, index) => ({
        symbol: token.symbol,
        value: parseFloat(token.balance_formatted) * token.usd_price,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      setAssetValues(values);
      setTotalValue(values.reduce((sum, asset) => sum + asset.value, 0));

      if (chartRef.current) {
        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current);
        }

        const option = {
          ...getPie3D(values, 0.8),
          backgroundColor: 'transparent',
          grid3D: {
            boxWidth: 100,
            boxHeight: 100,
            boxDepth: 100,
            axisTick: { show: false },
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: theme === 'dark' ? '#333' : '#eee'
              }
            },
            splitLine: {
              show: false
            }
          }
        };

        chartInstance.current.setOption(option);
      }
      setShowChart(true);
    };

    sequence();

    return () => {
      chartInstance.current?.dispose();
    };
  }, [tokens, totalValue, theme]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { t } = useI18n();

  const advisors = [
    "conservative",
    "growth",
    "quantitative", 
    "meme"
  ];

  const askForAdvice = async (advisorType: string) => {
    if (!address) {
      alert(t('wallet.overview.pleaseConnectWallet'));
      return;
    }

    if (!tokens || tokens.length === 0 || !assetValues.length) {
      alert(t('wallet.overview.noAssets'));
      return;
    }

    setCurrentSuggestion({ advisorType, suggestion: '', loading: true });
    setDialogOpen(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: t('advisor.chat.defaultQuestion')
          }],
          advisorType,
          assets: assetValues.map(asset => ({
            symbol: asset.symbol,
            value: asset.value
          }))
        }),
      });

      const data = await response.json();
      setCurrentSuggestion({ advisorType, suggestion: data.message, loading: false });
    } catch (error) {
      setCurrentSuggestion({ 
        advisorType, 
        suggestion: t('wallet.overview.failedToGetAdvice'), 
        loading: false 
      });
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                {t('wallet.overview.totalValue')}
              </h2>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold">
                  ${totalValue.toLocaleString()}
                </span>
                <span className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  +16.3%
                </span>
              </div>
            </div>
            
            <div className="h-[500px] w-[500px] relative">
              {showChart && assetValues.length > 0 ? (
                <div ref={chartRef} className="w-full h-full" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  {t('wallet.overview.noAssets')}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {advisors.map(advisor => (
                <Button
                  key={advisor}
                  variant="outline"
                  size="sm"
                  onClick={() => askForAdvice(advisor)}
                  className="flex items-center space-x-1"
                >
                  <Send className="h-4 w-4" />
                  <span>{t(`advisor.${advisor}.name`)}</span>
                </Button>
              ))}
            </div>

            <AdvisorDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  suggestion={currentSuggestion?.suggestion || ''}
  advisorType={currentSuggestion?.advisorType || ''}
  loading={currentSuggestion?.loading || false}
  t={t}
/>
          </div>
        </div>
      </Card>
    </>
  );
}