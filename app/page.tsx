'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarCanvas from './components/StarCanvas';

type DrawingState = 'initial' | 'drawing' | 'completed';

export default function Home() {
  const [drawState, setDrawState] = useState<DrawingState>('initial');
  const [startLabel, setStartLabel] = useState<string | null>(null);
  const [percent, setPercent] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [backgroundSwitched, setBackgroundSwitched] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (drawState === 'completed') {
      const backgroundTimer = setTimeout(() => {
        setBackgroundSwitched(true);
      }, 2500); // 1.5초 -> 3초로 증가

      const overlayTimer = setTimeout(() => {
        setOverlayVisible(true);
      }, 3000); // 2.5초 -> 5초로 증가

      return () => {
        clearTimeout(backgroundTimer);
        clearTimeout(overlayTimer);
      };
    } else {
      setBackgroundSwitched(false);
      setOverlayVisible(false);
    }
  }, [drawState]);

  const message =
    drawState === 'initial'
      ? '너는 별, 어떻게 그려?'
      : drawState === 'drawing'
      ? '당신만의 스타일을 그릴 시간이에요'
      : drawState === 'completed' && isLoadingStats
      ? '결과를 분석중이에요...'
      : drawState === 'completed' && startLabel
      ? `${percent}% 사람이 ${startLabel}을 선택했어요`
      : '당신의 스타일을 그릴 시간이에요';

  return (
    <main className="relative flex flex-col items-center px-2 py-3 text-white overflow-hidden min-h-screen">
      {/* 로고 */}
      <div className="mt-2 self-start ml-2 z-30">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={48}
          priority
          style={{ width: '120px', height: 'auto' }}
        />
      </div>

      {/* 콘텐츠 전체 - 로고 제외 */}
      <div
        className={`flex flex-col items-center w-full transition-opacity duration-1000 ${
          backgroundSwitched ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* 메시지 */}
        <div className="w-full text-center mt-2 sm:mt-4">
          <h1 className="text-base sm:text-lg font-semibold">{message}</h1>
        </div>

        {/* 별 그리기 */}
        <div className="mt-2 sm:mt-4">
          <StarCanvas
            drawState={drawState}
            setDrawState={setDrawState}
            onComplete={async (label) => {
              setIsLoadingStats(true);
              try {
                const response = await fetch('/api/submit-vote', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ selected: label }),
                });

                if (response.ok) {
                  const data = await response.json();
                  setStartLabel(label);
                  setPercent(data.percent);
                } else {
                  console.error('투표 저장 실패');
                  setStartLabel(label);
                  setPercent(20); // 기본값
                }
              } catch (error) {
                console.error('투표 저장 중 오류:', error);
                setStartLabel(label);
                setPercent(20); // 기본값
              } finally {
                setIsLoadingStats(false);
              }
            }}
          />
        </div>

        {/* 상품 + 안내 + 버튼 */}
        <div className="flex flex-col items-center w-full mt-2 space-y-2 max-[375px]:mt-1 max-[375px]:space-y-1">
          <img
            src="/prize2.png"
            alt="Prizes"
            className="w-full object-contain animate-float max-[375px]:max-h-[80px] max-h-[120px]"
          />

          <div className="text-[14px] leading-[1.3] text-center text-white font-medium flex flex-col max-[375px]:text-[12px]">
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
            <div className="mt-1 text-[15px] text-white font-bold text-center max-[375px]:text-[11px] animate-slide-up leading-snug">
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
              className="bg-[#C3D7F3] text-[#0B1545] font-bold px-5 py-2.5 rounded-lg shadow-[0_0_12px_white] text-sm"
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
                '추천 아이템 : Broken SHU Star-Back / White'}
              {startLabel === 'D' &&
                '추천 아이템 : Clione SHU Star-Back / Grey'}
              {startLabel === 'E' &&
                '추천 아이템 : Cross Belt Star-Back / Grey'}
              {!['A', 'B', 'C', 'D', 'E'].includes(startLabel || '') &&
                '추천 아이템 : Star-Back Grey'}
            </h1>
          </div>
          {/* 서브 메시지 (하단) */}
          <div className="absolute bottom-56 w-full text-center z-20 text-white text-sm sm:text-xs leading-snug">
            {startLabel === 'A' && (
              <>
                <p>절제된 블랙 톤에 미니멀한 컷.</p>
                <p>스타☆백 디테일이 조용하게 스며들어요.</p>
              </>
            )}
            {startLabel === 'B' && (
              <>
                <p>탄탐한 기능성 소재와 스타☆백 스타일의 조합으로</p>
                <p>심플하지만 뒷모습은 강렬한 핏 완성.</p>
              </>
            )}
            {startLabel === 'C' && (
              <>
                <p>귀여운 아트워크와 스타☆백 디테일.</p>
                <p>무심한 듯 귀여운 스윔웨어 연출에 딱.</p>
              </>
            )}
            {startLabel === 'D' && (
              <>
                <p>핏, 색감. 디테일 다 잡은 스타일리시 수영복.</p>
                <p>어께에서 떨어지는 스타☆백 스트랩이 포인트.</p>
              </>
            )}
            {startLabel === 'E' && (
              <>
                <p>리버시블 착용이 가능한 하이브리드 아이템.</p>
                <p>실내에서도, 해변에서도 스타☆백디테일로 시그니처 완성!</p>
              </>
            )}
            {!['A', 'B', 'C', 'D', 'E'].includes(startLabel || '') && (
              <>
                <p>절제된 블랙 톤에 미니멀한 컷.</p>
                <p>스타☆백 디테일이 조용하게 스며들어요.</p>
              </>
            )}
          </div>
          <div className="absolute bottom-44 w-full text-center z-20 text-white text-xs sm:text-[10px] leading-snug">
            <p>결과지를 캡쳐 후 SNS에 공유하면(@noitow_official)</p>
            <p>오프라인 팝업에서 추천상품을 15% 할인해드려요!</p>
          </div>
          <div className="absolute bottom-28 w-full text-center z-20">
            <a
              href="https://pf.kakao.com/_mxnxefn/friend"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#3A538B] text-white font-bold px-6 py-3 rounded-lg">
                플친 추가하고 꽝없는 선물 뽑기
              </button>
            </a>
          </div>
        </>
      )}

      {/* 오버레이 */}
      {overlayVisible && (
        <div className="absolute inset-0 z-10 pointer-events-none animate-fade-in">
          {startLabel === 'A' && (
            <img
              src="/sm-end-A.png"
              alt="Star Overlay A"
              className="w-full h-full object-cover"
            />
          )}
          {startLabel === 'B' && (
            <img
              src="/sm-end-B.png"
              alt="Star Overlay B"
              className="w-full h-full object-cover"
            />
          )}
          {startLabel === 'C' && (
            <img
              src="/sm-end-C.png"
              alt="Star Overlay C"
              className="w-full h-full object-cover"
            />
          )}
          {startLabel === 'D' && (
            <img
              src="/sm-end-D.png"
              alt="Star Overlay D"
              className="w-full h-full object-cover"
            />
          )}
          {startLabel === 'E' && (
            <img
              src="/sm-end-E.png"
              alt="Star Overlay E"
              className="w-full h-full object-cover"
            />
          )}
          {!['A', 'B', 'C', 'D', 'E'].includes(startLabel || '') && (
            <img
              src="/sm-end-A.png"
              alt="Star Overlay Default"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </main>
  );
}
