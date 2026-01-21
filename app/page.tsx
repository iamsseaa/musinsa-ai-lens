'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, Loader2, Search, ArrowRight, Sparkles, User, Palette } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeStyle = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-10">
      <header className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold tracking-tighter">MUSINSA AI LENS</h1>
        <button className="text-sm font-medium text-gray-500 hover:text-black">Login</button>
      </header>

      <div className="max-w-md mx-auto p-6 flex flex-col items-center gap-8 mt-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative shadow-sm"
        >
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">데일리룩 사진을 올려주세요</p>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <button
          onClick={analyzeStyle}
          disabled={!image || loading}
          className="w-full py-4 bg-black text-white text-lg font-bold rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
        >
          {loading ? <><Loader2 className="animate-spin" /> 초개인화 분석 중...</> : 'AI 스타일 분석하기'}
        </button>

        {result && (
          <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-xl animate-fade-in-up">
            {/* 스타일 헤더 */}
            <div className="mb-6 text-center">
              <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">AI Analysis</span>
              <h2 className="text-3xl font-black tracking-tight mt-1">{result.style}</h2>
            </div>

            {/* 퍼스널 컬러 & 체형 태그 */}
            <div className="flex justify-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-pink-100">
                <Palette className="w-3.5 h-3.5" />
                {result.personalColor}
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                <User className="w-3.5 h-3.5" />
                {result.bodyType}
              </div>
            </div>

            {/* 코멘트 */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm bg-gray-50 p-4 rounded-lg text-center">
              "{result.comment}"
            </p>

            {/* 추천 아이템 */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase flex items-center gap-1">
                <Search className="w-3 h-3" />
                추천 아이템 (무신사 검색)
              </h3>

              <div className="flex flex-col gap-2">
                {result.searchKeywords?.map((keyword: string, i: number) => (
                  <a
                    key={i}
                    href={`https://www.musinsa.com/search/musinsa/integration?keyword=${keyword}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-3 bg-white hover:bg-gray-50 rounded-lg group transition-colors border border-gray-200 shadow-sm"
                  >
                    <span className="font-medium text-gray-800">{keyword}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}