import Image from 'next/image';
import StarCanvas from './components/StarCanvas';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-4 text-white relative">
      {/* 로고 */}
      <div className="mt-1 self-start ml-2">
        <Image src="/logo.png" alt="Logo" width={150} height={60} priority />
      </div>

      {/* 텍스트 */}
      <div className="w-full text-center mt-10">
        <h1 className="text-lg font-semibold">
          당신의 스타일을 그릴시간이에요
        </h1>
      </div>

      {/* StarCanvas - 메시지에 붙여 배치 */}
      <div className="mt-8">
        <StarCanvas />
      </div>
    </main>
  );
}
