import { Dialog } from "@/components/ui/dialog";
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface LoadingProgressProps {
  isOpen: boolean;
  stage: number;
}

const STAGE_MESSAGES = [
  '扫描资产中...',
  '扫描交易记录中...',
  '资产优化中...'
];

export default function LoadingProgress({ isOpen, stage }: LoadingProgressProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();
  
  useEffect(() => {
    if (!chartRef.current || !isOpen) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        show: false,
        type: 'value',
        max: 100
      },
      yAxis: {
        type: 'category',
        data: ['进度'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      series: [{
        type: 'bar',
        data: [stage === 2 ? 100 : (stage + 1) * 33],
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: '#0052D9'
          }, {
            offset: 1,
            color: '#00B4FF'
          }])
        }
      }]
    };

    chartInstance.current.setOption(option);

    return () => {
      chartInstance.current?.dispose();
    };
  }, [isOpen, stage]);

  return (
    <Dialog open={isOpen} modal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-background p-8 rounded-lg w-[400px]">
          <div ref={chartRef} style={{ height: '60px' }} />
          <p className="text-center text-lg mt-4 text-primary">
            {STAGE_MESSAGES[stage]}
          </p>
        </div>
      </div>
    </Dialog>
  );
} 