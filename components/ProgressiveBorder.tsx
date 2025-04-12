"use client";

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface ProgressiveBorderProps {
  /**
   * The progress percentage (0-100).
   */
  progress: number;
  /**
   * The color of the border from.
   */
  colorFrom?: string;
  /**
   * The color of the border to.
   */
  colorTo?: string;
  /**
   * The class name of the border.
   */
  className?: string;
  /**
   * The thickness of the border.
   */
  thickness?: number;
}

export function ProgressiveBorder({
  progress,
  colorFrom = 'hsl(265, 89%, 78%)',
  colorTo = 'hsl(199, 89%, 48%)',
  className,
  thickness = 2,
}: ProgressiveBorderProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress)) / 100;
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    borderRadius: 0,
  });
  const [strokeLength, setStrokeLength] = useState(0);
  const gradientId = `border-gradient-${Math.floor(Math.random() * 10000)}`;

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const parentElement = svgRef.current.parentElement;
        const { width, height } = parentElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(parentElement);
        const borderRadius = parseInt(computedStyle.borderRadius || '0px', 10);

        setDimensions({
          width,
          height,
          borderRadius,
        });
      }
    };

    updateDimensions();

    if (svgRef.current && svgRef.current.parentElement) {
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(svgRef.current.parentElement);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const r = Math.min(dimensions.borderRadius, dimensions.width / 2, dimensions.height / 2);
      const straightLength = (dimensions.width - 2 * r) * 2 + (dimensions.height - 2 * r) * 2;
      const cornerLength = 2 * Math.PI * r;
      setStrokeLength(straightLength + cornerLength);
    }
  }, [dimensions]);

  function createSvgPath(width: number, height: number, borderRadius: number) {
    const r = Math.min(borderRadius, width / 2, height / 2);

    return `
      M ${width / 2},0
      H ${width - r}
      A ${r},${r} 0 0 1 ${width},${r}
      V ${height - r}
      A ${r},${r} 0 0 1 ${width - r},${height}
      H ${r}
      A ${r},${r} 0 0 1 0,${height - r}
      V ${r}
      A ${r},${r} 0 0 1 ${r},0
      H ${width / 2}
    `;
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ borderRadius: 'inherit' }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        style={{
          position: 'absolute',
          zIndex: 1,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: dimensions.width > 0 ? dimensions.width + thickness : '100%',
          height: dimensions.height > 0 ? dimensions.height + thickness : '100%',
        }}
        viewBox={
          dimensions.width > 0
            ? `-${thickness / 2} -${thickness / 2} ${dimensions.width + thickness} ${dimensions.height + thickness}`
            : '0 0 100 100'
        }
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>

        {dimensions.width > 0 && dimensions.height > 0 && (
          <path
            d={createSvgPath(dimensions.width, dimensions.height, dimensions.borderRadius)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            style={{
              strokeDasharray: strokeLength > 0 ? strokeLength : 'none',
              strokeDashoffset: strokeLength > 0 ? strokeLength * (1 - safeProgress) : 0,
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
        )}
      </svg>
    </div>
  );
}
