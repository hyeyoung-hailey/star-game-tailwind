'use client';

import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 480;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2 - 20;
const STAR_RADIUS_OUTER = 200;
const ROTATION_ANGLE = 45;
const CORRECT_PATH = [1, 3, 0, 2, 4, 1];
const labels = ['A', 'B', 'C', 'D', 'E'];

const points = Array.from({ length: 5 }, (_, i) => {
  const angle = (i * 72 - 162 + ROTATION_ANGLE) * (Math.PI / 180);
  return {
    x: CENTER_X + STAR_RADIUS_OUTER * Math.cos(angle),
    y: CENTER_Y + STAR_RADIUS_OUTER * Math.sin(angle),
  };
});

export default function StarCanvas({
  drawState,
  setDrawState,
  onComplete,
}: {
  drawState: 'initial' | 'drawing' | 'completed';
  setDrawState: (state: 'initial' | 'drawing' | 'completed') => void;
  onComplete?: (startLabel: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedVertices, setSelectedVertices] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverVertex, setHoverVertex] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setAngle((prev) => (prev + 0.02) % (Math.PI * 2));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const isNear = (x: number, y: number, pt: { x: number; y: number }) =>
    Math.hypot(pt.x - x, pt.y - y) <= 15;

  const isCyclicEqual = (ref: number[], input: number[]) => {
    const refCore = ref.slice(0, -1);
    const inputCore = input.slice(0, -1);
    if (refCore.length !== inputCore.length) return false;
    const len = refCore.length;
    for (let i = 0; i < len; i++) {
      const rotated = [...refCore.slice(i), ...refCore.slice(0, i)];
      if (rotated.join() === inputCore.join()) return true;
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const guide = [0, 2, 4, 1, 3, 0];
    ctx.beginPath();
    ctx.setLineDash([20, 12]);
    ctx.lineCap = 'butt';
    ctx.moveTo(points[guide[0]].x, points[guide[0]].y);
    for (let i = 1; i < guide.length; i++) {
      ctx.lineTo(points[guide[i]].x, points[guide[i]].y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 10;
    ctx.stroke();

    if (drawPoints.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.lineCap = 'butt';
      ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
      for (let i = 1; i < drawPoints.length; i++) {
        ctx.lineTo(drawPoints[i].x, drawPoints[i].y);
      }
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    points.forEach(({ x, y }, i) => {
      const isSelected = selectedVertices.includes(i);
      const radius = isSelected ? 14 : 8;

      ctx.save();
      ctx.translate(x, y);

      if (isSelected) {
        ctx.rotate(angle);
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'white';
      ctx.shadowBlur = isSelected ? 15 : 0;
      ctx.fill();
      ctx.restore();
    });

    const isComplete =
      selectedVertices.length >= 6 &&
      selectedVertices[0] === selectedVertices[selectedVertices.length - 1];

    if (isComplete) {
      points.forEach(({ x, y }, i) => {
        const angle = (i * 72 - 162 + ROTATION_ANGLE) * (Math.PI / 180);
        const offset = 20;
        const labelX = x + offset * Math.cos(angle);
        const labelY = y + offset * Math.sin(angle);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], labelX, labelY);
      });
    }

    ctx.setLineDash([]);
    ctx.lineCap = 'butt';
  }, [drawPoints, selectedVertices, hoverVertex]);

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (drawState !== 'drawing') return;
    const { x, y } = getCanvasCoordinates(e);
    for (let i = 0; i < points.length; i++) {
      if (isNear(x, y, points[i])) {
        setDrawPoints([points[i]]);
        setSelectedVertices([i]);
        setHoverVertex(i);
        setIsDrawing(true);

        // ⭐ 바로 한 번 move 효과 적용
        setDrawPoints((prev) => [...prev, { x, y }]);

        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (drawState !== 'drawing') return;
    const { x, y } = getCanvasCoordinates(e);
    if (!isDrawing) {
      for (let i = 0; i < points.length; i++) {
        if (isNear(x, y, points[i])) {
          setHoverVertex(i);
          return;
        }
      }
      setHoverVertex(null);
      return;
    }
    setDrawPoints((prev) => [...prev, { x, y }]);
    for (let i = 0; i < points.length; i++) {
      if (isNear(x, y, points[i])) {
        const already = selectedVertices.includes(i);
        const isClosing =
          selectedVertices.length === 5 && i === selectedVertices[0];
        if (!already || isClosing) {
          setSelectedVertices((prev) => [...prev, i]);
          setDrawPoints((prev) => [...prev, points[i]]);
          return;
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (drawState !== 'drawing') return;
    setIsDrawing(false);
    setHoverVertex(null);

    if (
      selectedVertices.length === 6 &&
      selectedVertices[0] === selectedVertices[selectedVertices.length - 1]
    ) {
      setDrawState('completed');

      const startIndex = selectedVertices[0];
      const label = labels[startIndex];

      onComplete?.(label); // ✅ 이 줄이 핵심
    }
  };

  return (
    <div className="w-full flex justify-center items-start pt-2">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="bg-transparent touch-none w-full max-w-[400px] max-[375px]:max-w-[320px]"
      />
    </div>
  );
}
