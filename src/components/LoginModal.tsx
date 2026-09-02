import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, Loader2 } from 'lucide-react';
import type { MembershipTier } from '../types/sports';
import { authService } from '../services/auth/authService';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; tier: MembershipTier; email: string }) => void;
}

export const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<'SOCIAL' | 'EMAIL_LOGIN' | 'EMAIL_SIGNUP'>('SOCIAL');

  // Form states
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  
  // Loading states
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingKakao, setIsLoadingKakao] = useState<boolean>(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);

  // 🌐 Handle Real Google Login
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoadingGoogle(true);

    try {
      const user = await authService.loginWithGoogle();
      setSuccessMsg(`🟢 [${user.name}] 구글 계정으로 로그인되었습니다!`);
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
        });
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google 로그인에 실패했습니다.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // 🟡 Handle Real Kakao Login
  const handleKakaoLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoadingKakao(true);

    try {
      const user = await authService.loginWithKakao();
      setSuccessMsg(`🎉 [${user.name}] 카카오 계정으로 로그인되었습니다!`);
      setTimeout(() => {
        onLoginSuccess({
          name: user.name,
          tier: user.tier,
          email: user.email,
        });
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || '카카오 로그인에 실패했습니다.');
    } finally {
      setIsLoadingKakao(false);
    }
  };

  // Handle Email Form Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoadingEmail(true);

    try {
      if (activeTab === 'EMAIL_LOGIN') {
        if (!emailInput.trim() || !passwordInput.trim()) {
          setErrorMsg('이메일과 비밀번호를 모두 입력해 주세요.');
          setIsLoadingEmail(false);
          return;
        }

        const user = await authService.loginWithEmail(emailInput.trim(), passwordInput.trim());
        setSuccessMsg(`🟢 [${user.name}] 로그인 성공! 시스템에 접속합니다.`);
        setTimeout(() => {
          onLoginSuccess({
            name: user.name,
            tier: user.tier,
            email: user.email,
          });
        }, 400);
      } else if (activeTab === 'EMAIL_SIGNUP') {
        if (!emailInput.trim() || !passwordInput.trim()) {
          setErrorMsg('모든 필수 항목을 입력해 주세요.');
          setIsLoadingEmail(false);
          return;
        }
        if (passwordInput.length < 6) {
          setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
          setIsLoadingEmail(false);
          return;
        }

        const user = await authService.signUpWithEmail(emailInput.trim(), passwordInput.trim(), nicknameInput.trim());
        setSuccessMsg(`🎉 [${user.name}] 회원가입 완료! 자동 로그인합니다.`);
        setTimeout(() => {
          onLoginSuccess({
            name: user.name,
            tier: user.tier,
            email: user.email,
          });
        }, 400);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        
        {/* Glow Ambient Effect */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              {activeTab === 'SOCIAL' 
                ? '🔑 간편 소셜 계정 로그인' 
                : activeTab === 'EMAIL_LOGIN' 
                ? '✉️ 이메일 계정 로그인' 
                : '📝 이메일 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 relative z-10 text-[11px]">
          <button
            onClick={() => {
              setActiveTab('SOCIAL');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl font-black transition-all cursor-pointer ${
              activeTab === 'SOCIAL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ 간편 소셜
          </button>
          <button
            onClick={() => {
              setActiveTab('EMAIL_LOGIN');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl font-black transition-all cursor-pointer ${
              activeTab === 'EMAIL_LOGIN'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 이메일 로그인
          </button>
          <button
            onClick={() => {
              setActiveTab('EMAIL_SIGNUP');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl font-black transition-all cursor-pointer ${
              activeTab === 'EMAIL_SIGNUP'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📝 이메일 가입
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/90 text-rose-200 rounded-xl border border-rose-500 text-xs font-bold flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/90 text-emerald-200 rounded-xl border border-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SOCIAL LOGIN PANEL (구글 & 카카오) */}
        {activeTab === 'SOCIAL' && (
          <div className="space-y-3 relative z-10 pt-1">
            <p className="text-slate-400 text-xs text-center font-medium leading-relaxed">
              본인 소유의 실제 <strong className="text-white">Google</strong> 또는 <strong className="text-yellow-400">카카오톡</strong> 아이디로 안전하고 간편하게 바로 접속하실 수 있습니다.
            </p>

            {/* 🟡 KAKAO OFFICIAL LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleKakaoLogin}
              disabled={isLoadingKakao || isLoadingGoogle}
              className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] border border-yellow-400"
            >
              {isLoadingKakao ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#191919]" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.767 1.83 5.19 4.606 6.556l-.938 3.522a.5.5 0 0 0 .736.545l4.24-2.823c.44.045.892.067 1.356.067 5.523 0 10-3.477 10-7.767C22 6.477 17.523 3 12 3z" />
                </svg>
              )}
              <span>{isLoadingKakao ? '카카오 로그인 연결 중...' : '카카오 계정으로 로그인'}</span>
            </button>

            {/* 🌐 GOOGLE OFFICIAL LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle || isLoadingKakao}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] border border-slate-300"
            >
              {isLoadingGoogle ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isLoadingGoogle ? 'Google 로그인 연결 중...' : 'Google 계정으로 로그인'}</span>
            </button>

            {/* VVIP Badge notice */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40 flex items-center justify-between text-xs font-bold mt-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> 로그인 혜택:
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[11px] shadow-sm">
                👑 100% 팩트 데이터 즉시 개방
              </span>
            </div>
          </div>
        )}

        {/* 2. EMAIL FORM (로그인 / 회원가입) */}
        {activeTab !== 'SOCIAL' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs relative z-10">
            
            {/* Signup Nickname Field */}
            {activeTab === 'EMAIL_SIGNUP' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  닉네임 (활동명):
                </label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="예: 팩트분석마스터"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                이메일 주소:
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="예: user@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                비밀번호:
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="6자리 이상 비밀번호 입력"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoadingEmail}
              className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-200 mt-2"
            >
              {isLoadingEmail ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>{activeTab === 'EMAIL_LOGIN' ? '이메일로 로그인' : '이메일로 가입 및 접속'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

