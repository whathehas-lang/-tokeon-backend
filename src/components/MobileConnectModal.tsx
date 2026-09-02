import React, { useState, useEffect } from 'react';
import { X, Smartphone, QrCode, Copy, Check, Sparkles, Globe } from 'lucide-react';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const MobileConnectModal = ({ isOpen, onClose, theme = 'light' }: MobileConnectModalProps) => {
  const isLight = theme === 'light';
  const [copied, setCopied] = useState(false);
  const [mobileUrl, setMobileUrl] = useState('http://192.168.219.103:5173');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      if (host === 'localhost' || host === '127.0.0.1') {
        setMobileUrl(`http://192.168.219.103${port || ':5173'}`);
      } else {
        setMobileUrl(`${window.location.protocol}//${host}${port}`);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* HEADER */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isLight ? 'border-slate-100 bg-slate-50/80' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base flex items-center gap-1.5">
                <span>📱 스마트폰에서 모바일 앱으로 자유롭게 사용하기</span>
              </h3>
              <p className="text-[10.5px] text-slate-500 font-medium">핸드폰 카메라로 QR 스캔 또는 홈 화면에 추가</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* QR CODE & INSTANT CONNECT */}
          <div className={`p-4 rounded-2xl border text-center space-y-3 shadow-sm ${
            isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950 border-emerald-500/40'
          }`}>
            <span className="text-xs font-black text-emerald-600 block flex items-center justify-center gap-1">
              <QrCode className="w-4 h-4" /> 스마트폰 카메라로 아래 QR 코드를 비춰주세요!
            </span>

            <div className="flex justify-center py-1">
              <div className="p-2.5 bg-white rounded-2xl shadow-md border-2 border-emerald-400 inline-block">
                <img 
                  src={qrCodeUrl} 
                  alt="모바일 접속 QR 코드" 
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* URL COPY BOX */}
            <div className="flex items-center gap-1.5 max-w-sm mx-auto">
              <input 
                type="text" 
                readOnly 
                value={mobileUrl} 
                className={`flex-1 text-center font-mono text-xs px-3 py-2 rounded-xl border font-bold ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-amber-300'
                }`}
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '주소복사'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              * 동일한 Wi-Fi(공유기)에 연결된 스마트폰에서 즉시 열립니다.
            </p>
          </div>

          {/* 📲 PWA [홈 화면에 추가] 진짜 앱 만들기 가이드 */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-1.5 font-black text-xs text-amber-500">
              <Sparkles className="w-4 h-4" />
              <span>📲 스마트폰 홈 화면에 진짜 앱 아이콘 설치하는 방법</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* 아이폰 Safari */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <span>🍎 아이폰 (Safari)</span>
                </div>
                <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>사파리 브라우저 하단 <strong>[공유 아이콘 (네모+화살표)]</strong> 클릭</li>
                  <li>메뉴에서 <strong>[홈 화면에 추가]</strong> 선택</li>
                  <li>스마트폰 바탕화면에 <strong>[스포츠모든것] 앱 아이콘 생성 완료!</strong></li>
                </ol>
              </div>

              {/* 안드로이드 Chrome */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <span>🤖 갤럭시/안드로이드 (Chrome)</span>
                </div>
                <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>크롬 브라우저 우측 상단 <strong>[점 3개 메뉴 (⋮)]</strong> 클릭</li>
                  <li><strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong> 클릭</li>
                  <li>네이티브 앱처럼 바탕화면에 설치 완료!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 🌐 어디서나 LTE/5G로 자유롭게 접속하는 무료 클라우드 배포 안내 */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs ${
            isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            <Globe className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px]">
              <strong className="font-black block text-xs">🌐 사무실 밖에서도 전 세계 스마트폰으로 접속하려면?</strong>
              <p className="leading-relaxed">
                Vercel 또는 Netlify에 원클릭 무료 배포하면, <strong>`https://내앱이름.vercel.app`</strong> 같은 영구 무료 도메인이 생성되어 Wi-Fi 없이도 LTE/5G로 어디서나 자유롭게 열립니다.
              </p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className={`p-3 sm:p-4 border-t flex justify-end ${
          isLight ? 'border-slate-100 bg-slate-50/80' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl text-xs font-black transition-all cursor-pointer shadow"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
