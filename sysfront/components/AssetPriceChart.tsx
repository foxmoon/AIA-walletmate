"use client";

import { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';

interface PriceData {
  time: string;
  value: number;
}

interface AssetPriceChartProps {
  symbol: string;
  priceData: PriceData[];
}

export function AssetPriceChart({ symbol, priceData }: AssetPriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !priceData.length) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(0, 0, 0, 0.5)',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(0, 0, 0, 0.1)', style: LineStyle.Dotted },
      },
      width: chartContainerRef.current.clientWidth,
      height: 120,
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      rightPriceScale: {
        visible: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        autoScale: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      watermark: {
        visible: false,
      },
    });

    const priceSeries = chart.addLineSeries({
      color: '#2563eb',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lineType: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    const animate = () => {
      const totalDuration = 10000; // 10秒
      let startTime = Date.now();
      let progress = 0;
      
      // 初始显示完整数据
      priceSeries.setData(priceData);
      
      const updateAnimation = () => {
        const currentTime = Date.now();
        progress = ((currentTime - startTime) % totalDuration) / totalDuration;
        
        // 计算当前应该显示的数据点数量
        const pointCount = Math.floor(priceData.length * progress);
        
        // 确保数据格式正确
        const visibleData = priceData.slice(0, pointCount).map(point => ({
          time: point.time,
          value: point.value
        }));
        
        if (visibleData.length >= 2) {
          priceSeries.setData(visibleData);
          
          // 更新时间轴范围
          chart.timeScale().setVisibleLogicalRange({
            from: 0,
            to: priceData.length - 1,
          });
        }

        if (progress >= 1) {
          startTime = currentTime;
        }

        animationRef.current = requestAnimationFrame(updateAnimation);
      };

      animationRef.current = requestAnimationFrame(updateAnimation);
    };

    // 启动动画
    animate();

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      chart.remove();
    };
  }, [priceData]);

  return <div ref={chartContainerRef} className="w-full h-[120px]" />;
} 