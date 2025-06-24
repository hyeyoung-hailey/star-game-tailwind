'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarCanvas from './components/StarCanvas';

type DrawingState = 'initial' | 'drawing' | 'completed';

// 기본 퍼센트 값 (API 실패 시 사용)
const DEFAULT_PERCENTS: Record<string, number> = {
  A: 22,
  B: 25,
  C: 18,
  D: 20,
  E: 15,
};

export default function Home() {
  const [drawState, setDrawState] = useState<DrawingState>('initial');
  const [startLabel, setStartLabel] = useState<string | null>(null);
  const [backgroundSwitched, setBackgroundSwitched] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [percent, setPercent] = useState<number | null>(null);

  const isCompleteReady =
    drawState === 'completed' && startLabel !== null && percent !== null;

  useEffect(() => {
    if (drawState === 'completed') {
      const backgroundTimer = setTimeout(() => {
        setBackgroundSwitched(true);
      }, 5500);

      const overlayTimer = setTimeout(() => {
        setOverlayVisible(true);
      }, 5500);

      return () => {
        clearTimeout(backgroundTimer);
        clearTimeout(overlayTimer);
      };
    } else {
      setBackgroundSwitched(false);
      setOverlayVisible(false);
    }
  }, [drawState, startLabel, percent]);

  const message = (() => {
    if (drawState === 'initial') return '너는 별, 어떻게 그려?';
    if (drawState === 'drawing') return '당신만의 스타일을 그릴 시간이에요';
    if (isCompleteReady)
      return `${startLabel}에서 시작했어요. 전체 중 ${percent}%가 이 별을 선택했어요`;
    return '';
  })();

  return (
    <main className="relative min-h-screen flex flex-col items-center px-2 py-6 text-white overflow-hidden">
      {/* 로고 */}
      <div className="mt-1 self-start ml-2 z-30">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={60}
          priority
          style={{ width: '150px', height: 'auto' }}
        />
      </div>

      {/* 콘텐츠 전체 - 로고 제외 */}
      <div
        className={`flex flex-col items-center w-full transition-opacity duration-1000 ${
          backgroundSwitched ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* 메시지 */}
        <div className="w-full text-center mt-6 sm:mt-10">
          <h1 className="text-base sm:text-lg font-semibold">{message}</h1>
        </div>

        {/* 별 그리기 */}
        <div className="mt-4 sm:mt-8">
          <StarCanvas
            drawState={drawState}
            setDrawState={setDrawState}
            onComplete={async (label) => {
              try {
                const res = await fetch('/api/submit-vote', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ selected: label }),
                });
                const result = await res.json();

                setStartLabel(label);
                setPercent(result.percent || DEFAULT_PERCENTS[label] || 20);
                setDrawState('completed');
              } catch (e) {
                console.error('투표 저장 실패:', e);
                setStartLabel(label);
                setPercent(DEFAULT_PERCENTS[label] || 20);
                setDrawState('completed');
              }
            }}
          />
        </div>

        {/* 상품 + 안내 + 버튼 */}
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
      </div>

      {/* 오베레이 이후 콘텐츠 */}
      {overlayVisible && (
        <>
          <div className="w-full text-center mt-6 sm:mt-10 absolute top-20 z-20">
            <h1 className="text-base sm:text-lg font-semibold text-white">
              {startLabel === 'A' && '추천 아이템 : Music Note Star-Back Black'}
              {startLabel === 'B' && '추천 아이템 : Striped Star-Back Blue'}
              {startLabel === 'C' &&
                '추천 아이템 : Broken SHUE Star-Back White'}
              {startLabel === 'D' && '추천 아이템 : Clione SHU Star-Back Grey'}
              {startLabel === 'E' && '추천 아이템 : Cross Belt Star-Back Grey'}
              {!['A', 'B', 'C', 'D', 'E'].includes(startLabel || '') &&
                '추천 아이템 : Star-Back Grey'}
            </h1>
          </div>
          {/* 서브 메시지 (하단) */}
          <div className="absolute bottom-56 w-full text-center z-20 text-white text-sm sm:text-xs leading-snug">
            <p>당신의 스타일에 맞춘 수영복 추천과</p>
            <p>15% 할인 + 랜덤 선물의 기회도 받아가세요!</p>
          </div>
          <div className="absolute bottom-44 w-full text-center z-20 text-white text-xs sm:text-[10px] leading-snug">
            <p>*별을 완성하면 추천 수영복이 나타나요</p>
            <p>*랜덤 선물은 기간 내 참여 시 제공됩니다</p>
          </div>
          <div className="absolute bottom-28 w-full text-center z-20">
            <button className="bg-[#3A538B] text-white font-bold px-6 py-3 rounded-lg">
              플친 추가하고 꽝없는 선물 뽑기
            </button>
          </div>
        </>
      )}

      {/* 오버레이 */}
      {overlayVisible && (
        <div className="absolute inset-0 z-10 pointer-events-none animate-fade-in">
          <img
            src="/end-bg.png"
            alt="Star Overlay"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </main>
  );
}
