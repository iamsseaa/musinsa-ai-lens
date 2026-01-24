'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Search, ArrowRight, Palette, User, MessageSquare, Send, Maximize2, X } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 채팅 관련 상태 추가
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatEndRefFullscreen = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setChatMessages([]); // 이미지 바뀌면 채팅 초기화
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
      // 초기 환영 메시지 자동 추가
      setChatMessages([
        { role: 'assistant', content: `반가워요! ${data.style} 스타일이 정말 잘 어울리시네요. 더 궁금한 점이나 코디 고민이 있으신가요?` }
      ]);
    } catch (error) {
      console.error(error);
      alert('분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 채팅 전송 함수
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          analysisContext: result // 분석 결과(Context)를 같이 보냄
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  // 채팅 스크롤 자동 내리기
  useEffect(() => {
    if (isChatFullscreen) {
      chatEndRefFullscreen.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatFullscreen]);

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-10">
      <header className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold tracking-tighter">MUSINSA AI LENS</h1>
        <button className="text-sm font-medium text-gray-500 hover:text-black">Login</button>
      </header>

      <div className="max-w-md mx-auto p-6 flex flex-col items-center gap-6 mt-2">
        {/* 이미지 영역 */}
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

        {!result && (
          <button
            onClick={analyzeStyle}
            disabled={!image || loading}
            className="w-full py-4 bg-black text-white text-lg font-bold rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
          >
            {loading ? <><Loader2 className="animate-spin" /> 스타일 분석 중...</> : 'AI 스타일 분석하기'}
          </button>
        )}

        {result && (
          <div className="w-full space-y-6">
            {/* 1. 분석 결과 카드 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl animate-fade-in-up">
              <div className="mb-6 text-center">
                <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">AI Analysis</span>
                <h2 className="text-3xl font-black tracking-tight mt-1">{result.style}</h2>
              </div>

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
              {result.comment && (
                <p className="text-gray-600 leading-relaxed mb-6 text-sm bg-gray-50 p-4 rounded-lg text-center">
                  "{result.comment}"
                </p>
              )}

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  추천 아이템
                </h3>
                <div className="flex flex-col gap-3">
                  {result.searchKeywords?.map((keyword: string, i: number) => (
                    <a
                      key={i}
                      href={`https://www.musinsa.com/search/about?q=${encodeURIComponent(keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 shadow-sm group transition-all"
                    >
                      <span className="font-bold text-gray-800">{keyword}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. AI MD 채팅 영역 (NEW) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-black" />
                  <h3 className="text-sm font-bold">AI 패션 MD 상담</h3>
                </div>
                <button
                  onClick={() => setIsChatFullscreen(true)}
                  className="text-gray-400 hover:text-black transition-colors p-1"
                  title="전체 보기"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="h-48 overflow-y-auto mb-4 space-y-3 p-1">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-black text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="예: 이 옷에 어울리는 신발 추천해줘"
                  className="w-full p-3 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black disabled:text-gray-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 전체 보기 모달 */}
      {isChatFullscreen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-black" />
              <h2 className="text-lg font-bold">AI 패션 MD 상담</h2>
            </div>
            <button
              onClick={() => setIsChatFullscreen(false)}
              className="text-gray-400 hover:text-black transition-colors p-2"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 채팅 영역 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl text-base leading-relaxed ${msg.role === 'user'
                    ? 'bg-black text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRefFullscreen} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-gray-200 p-5 bg-white">
            <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="예: 이 옷에 어울리는 신발 추천해줘"
                className="w-full p-4 pr-12 rounded-lg border border-gray-300 text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black"
                autoFocus
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black disabled:text-gray-200 transition-colors"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}