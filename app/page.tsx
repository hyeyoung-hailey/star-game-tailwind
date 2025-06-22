// app/page.tsx or Home.tsx

'use client';

import Image from 'next/image';
import { useState } from 'react';
import StarCanvas from './components/StarCanvas';

export default function Home() {
  const [startLabel, setStartLabel] = useState<string | null>(null);

  const message = startLabel
    ? `당신의 스타일은 ${startLabel}에서 시작했어요`
    : '당신의 스타일을 그릴시간이에요';

  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-4 text-white relative">
      {/* 로고 */}
      <div className="mt-1 self-start ml-2">
        <Image src="/logo.png" alt="Logo" width={150} height={60} priority />
      </div>

      {/* 텍스트 */}
      <div className="w-full text-center mt-10">
        <h1 className="text-lg font-semibold">{message}</h1>
      </div>

      {/* StarCanvas */}
      <div className="mt-8">
        <StarCanvas onComplete={(label) => setStartLabel(label)} />
      </div>

      {/* 별 외부 - 상품 이미지와 버튼 */}
      <div className="flex flex-col items-center w-100 space-y-3">
        <img
          src="/prize2.png"
          alt="Prizes"
          className="w-full object-contain animate-float"
        />
        <div className="text-[14px] leading-[1.4] text-center text-white font-medium flex flex-col">
          <span>나만의 별 그리는 방법을 공유하고</span>
          <span>수영복 추천과 랜덤 선물까지 받아가자!</span>
        </div>

        <button className="bg-[#C3D7F3] hover:bg-[#b5ccef] text-[#0B1545] text-[16px] font-bold px-6 py-3 rounded-lg transition">
          게임 참여하고 선물받기
        </button>
      </div>
    </main>
  );
}
