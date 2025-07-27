import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  isActive: boolean;
  className?: string;
}

const WaveformVisualizer = ({ isActive, className }: WaveformVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const bars = 20;
    const barWidth = width / bars;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (isActive) {
        ctx.fillStyle = 'hsl(var(--primary))';
        
        for (let i = 0; i < bars; i++) {
          const barHeight = Math.random() * height * 0.6 + 10;
          const x = i * barWidth + barWidth * 0.2;
          const y = centerY - barHeight / 2;
          
          ctx.fillRect(x, y, barWidth * 0.6, barHeight);
        }
        
        animationRef.current = requestAnimationFrame(draw);
      } else {
        // Draw static bars when inactive
        ctx.fillStyle = 'hsl(var(--muted-foreground))';
        
        for (let i = 0; i < bars; i++) {
          const barHeight = 4;
          const x = i * barWidth + barWidth * 0.2;
          const y = centerY - barHeight / 2;
          
          ctx.fillRect(x, y, barWidth * 0.6, barHeight);
        }
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className={cn('rounded-md', className)}
    />
  );
};

export default WaveformVisualizer;