// app/page.tsx or Home.tsx

'use client';

import Image from 'next/image';
import { useState } from 'react';
import StarCanvas from './components/StarCanvas';

type DrawingState = 'initial' | 'drawing' | 'completed';

export default function Home() {
  const [drawState, setDrawState] = useState<
    'initial' | 'drawing' | 'completed'
  >('initial');
  const [startLabel, setStartLabel] = useState<string | null>(null);

  const message =
    drawState === 'initial'
      ? '너는 별, 어떻게 그려?'
      : drawState === 'drawing'
      ? '당신만의 스타일을 그릴 시간이에요'
      : startLabel
      ? `당신의 스타일은 ${startLabel}에서 시작했어요`
      : '당신의 스타일을 그릴 시간이에요'; // fallback (혹시 모를 오류 대비)

  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-6 text-white relative overflow-hidden">
      {/* 로고 */}
      <div className="mt-1 self-start ml-2">
        <Image src="/logo.png" alt="Logo" width={150} height={60} priority />
      </div>

      {/* 메시지 */}
      <div className="w-full text-center mt-6 sm:mt-10">
        <h1 className="text-base sm:text-lg font-semibold">{message}</h1>
      </div>

      {/* 별 그리기 영역 */}
      <div className="mt-4 sm:mt-8">
        <StarCanvas
          drawState={drawState}
          setDrawState={setDrawState}
          onComplete={(label) => setStartLabel(label)}
        />
      </div>

      {/* 상품 이미지 + 안내 + 버튼 */}
      <div className="flex flex-col items-center w-full mt-8 space-y-3 max-[375px]:mt-4 max-[375px]:space-y-2">
        <img
          src="/prize2.png"
          alt="Prizes"
          className="w-full object-contain animate-float max-[375px]:max-h-[100px]"
        />

        <div className="text-[14px] leading-[1.4] text-center text-white font-medium flex flex-col max-[375px]:text-[12px]">
          {drawState === 'initial' && (
            <>
              <span>나만의 별 그리는 방법을 공유하고</span>
              <span>수영복 추천과 랜덤 선물까지 받아가자!</span>
            </>
          )}
          {drawState === 'drawing' && (
            <>
              <span>점을 따라 별을 그려보세요</span>
              <span>순서대로 연결하면 완성됩니다.</span>
            </>
          )}
          {drawState === 'completed' && (
            <>
              <span>추천 제품 15% 할인 + 랜덤 선물뽑기권 당첨!</span>
            </>
          )}
        </div>

        {/* 완료 후 별도 문구 */}
        {drawState === 'completed' && (
          <div className="mt-2 text-[16px] text-white font-bold text-center max-[375px]:text-[12px] animate-slide-up leading-snug">
            {startLabel === 'A' && (
              <>
                <p>다 말하지 않아도 전해지는 분위기.</p>
                <p>당신은 묵직한 존재감의 소유자예요</p>
              </>
            )}
            {startLabel === 'B' && (
              <>
                <p>실력도 스타일도 빠짐없는 완성형.</p>
                <p>어딜가나 자연스럽게 중심점이 되는 타입</p>
              </>
            )}
            {startLabel === 'C' && (
              <>
                <p>분위기 반전 장인.</p>
                <p>귀엽다가 멋있고, 평범한 듯 독특해요.</p>
              </>
            )}
            {startLabel === 'D' && (
              <>
                <p>친구들 사이에선 늘 눈에 띄는 사람.</p>
                <p>'꾸안꾸' 스타일링 고수예요</p>
              </>
            )}
            {startLabel === 'E' && (
              <>
                <p>실용적이지만 절대 평범하진 않죠.</p>
                <p>선택에도 기준이 확실한 타입!</p>
              </>
            )}
            {!['A', 'B', 'C', 'D', 'E'].includes(startLabel || '') && (
              <>
                <p>두근두근 ..</p>
                <p>당신의 별이 완성됐어요!</p>
              </>
            )}
          </div>
        )}

        {drawState === 'initial' && (
          <button
            className="bg-[#C3D7F3] text-[#0B1545] font-bold px-6 py-3 rounded-lg shadow-[0_0_12px_white]"
            onClick={() => setDrawState('drawing')}
          >
            게임 참여하고 선물받기
          </button>
        )}
      </div>
    </main>
  );
}
