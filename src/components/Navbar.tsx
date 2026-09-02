import React from 'react';
import { Trophy, Smartphone, MessageSquare, LogIn, LogOut, User, Crown, Clock, LayoutGrid } from 'lucide-react';
import type { BetmanFolderCategory, MembershipTier, ViewMode } from '../types/sports';
import { getDynamicBetmanGamesMetadata } from '../services/betman/betmanRoundRegistry';

interface NavbarProps {
  selectedFolder: BetmanFolderCategory;
  onSelectFolder: (folder: BetmanFolderCategory) => void;
  selectedRound: string;
  onSelectRound: (round: string) => void;
  membershipTier: MembershipTier;
  onChangeMembershipTier: (tier: MembershipTier) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  activeTab: 'home' | 'community' | 'profile';
  setActiveTab: (tab: 'home' | 'community' | 'profile') => void;
  isLoggedIn: boolean;
  userName?: string;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  hidePassedMatches: boolean;
  setHidePassedMatches: (val: boolean) => void;
  cardDensity: 'COMPACT' | 'DETAILED';
  setCardDensity: (val: 'COMPACT' | 'DETAILED') => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenMobileConnectModal?: () => void;
}

export const Navbar = ({
  selectedFolder,
  onSelectFolder,
  selectedRound,
  onSelectRound,
  onToggleViewMode,
  activeTab,
  setActiveTab,
  isLoggedIn,
  userName = '토큰VVIP회원',
  onOpenLoginModal,
  onLogout,
  theme = 'light',
  onToggleTheme,
  hidePassedMatches,
  setHidePassedMatches,
  cardDensity,
  setCardDensity,
  onRefresh,
  isRefreshing = false,
  onOpenMobileConnectModal,
}: NavbarProps) => {
  const isLight = theme === 'light';
  const dynamicMeta = getDynamicBetmanGamesMetadata();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 w-full ${
      isLight ? 'bg-white/95 border-slate-200/80 shadow-sm' : 'bg-slate-950/95 border-slate-900/90 shadow-2xl'
    }`}>
      {/* PRIMARY TOP HEADER BAR */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* LOGO & BRAND NAME */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-amber-300 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 group-hover:text-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className={`font-black text-xs sm:text-base tracking-tight transition-colors ${
                  isLight ? 'text-slate-950 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'
                }`}>
                  토큰 <span className="text-amber-500 text-[10px] sm:text-xs font-bold">(Tokeon)</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-black shadow-sm">
                  100% FACT
                </span>
              </div>
              <span className={`text-[9px] sm:text-[9.5px] font-medium hidden sm:block leading-none mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                tokeon.co.kr • 주관적 예측 0% 오피셜 데이터
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ULTRA-CLEAN ACTION BAR */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* 📱 SMARTPHONE CONNECT BUTTON */}
          {onOpenMobileConnectModal && (
            <button
              onClick={onOpenMobileConnectModal}
              className={`px-2 py-1.5 sm:px-2.5 sm:py-1 rounded-xl text-[10.5px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer border shadow-sm ${
                isLight 
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/60'
              }`}
              title="스마트폰으로 모바일 앱 열기 및 홈 화면에 추가"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="font-extrabold hidden sm:inline">📱 모바일 앱</span>
              <span className="font-extrabold sm:hidden">📱 앱</span>
            </button>
          )}

          {/* 🔄 ONE-TOUCH REAL-TIME REFRESH BUTTON */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`px-2 py-1.5 sm:px-3 sm:py-1 rounded-xl text-[10.5px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer border shadow-sm ${
                isRefreshing 
                  ? 'bg-emerald-500 text-white animate-pulse' 
                  : isLight 
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300' 
                    : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
              }`}
              title="실시간 최신 데이터 즉시 갱신"
            >
              <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
              <span className="font-extrabold">{isRefreshing ? '갱신중' : '새로고침'}</span>
            </button>
          )}

          {/* ☀️/🌙 THEME SWITCHER BUTTON */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer border shadow-sm ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
              }`}
              title={isLight ? '어두운 다크 모드로 전환' : '밝은 라이트 모드로 전환'}
            >
              <span>{isLight ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline">{isLight ? '밝은모드' : '다크모드'}</span>
            </button>
          )}

          {/* TAB MODE SWITCHER BUTTONS */}
          <div className={`flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl border shadow-inner ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <button
              onClick={() => {
                onToggleViewMode('APP');
                setActiveTab('home');
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-white shadow-sm scale-[1.02]'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>📱</span>
              <span className="hidden sm:inline">경기목록</span>
              <span className="sm:hidden">경기</span>
            </button>
            <button
              onClick={() => {
                onToggleViewMode('PC_WEB');
                setActiveTab('community');
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-amber-400 text-slate-950 shadow-sm scale-[1.02]'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>💬</span>
              <span className="hidden sm:inline">채팅방</span>
              <span className="sm:hidden">톡</span>
            </button>
          </div>



          {/* VVIP 유료 전용 뱃지 */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-xl font-black text-[11px] shadow border border-yellow-200">
            <Crown className="w-3.5 h-3.5 text-slate-950" />
            <span>VVIP 팩트 회원</span>
          </div>

          {/* AUTH LOGIN & LOGOUT AREA */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-amber-300'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate max-w-[70px]">{userName}</span>
              </button>
              
              <button
                onClick={onLogout}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                title="로그아웃"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-md border border-yellow-200"
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 stroke-[3]" />
              <span>로그인</span>
            </button>
          )}

        </div>

      </div>

      {/* SECONDARY FOLDER CATEGORY PILLS BAR */}
      {activeTab === 'home' && (
        <div className={`border-t w-full ${
          isLight ? 'border-slate-100 bg-slate-50/80' : 'border-slate-900 bg-slate-950'
        }`}>
          <div className="max-w-7xl mx-auto px-2 py-2 grid grid-cols-2 md:flex md:flex-row items-center gap-1.5 w-full">
            
            {/* 🎟️ 프로토 승부식 + 회차 선택 드롭다운 */}
            <div
              onClick={() => onSelectFolder('SEUNGBUSHIK')}
              className={`col-span-1 w-full px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-between gap-1.5 border ${
                selectedFolder === 'SEUNGBUSHIK' || selectedFolder === 'ALL'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span>🎟️ 승부식</span>
              <select
                value={selectedFolder === 'SEUNGBUSHIK' ? selectedRound : `프로토 승부식 ${dynamicMeta.G101.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectFolder('SEUNGBUSHIK');
                  onSelectRound(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-amber-300 hover:bg-amber-200 text-amber-950 border border-amber-500/80 rounded px-1 py-0.5 text-[9px] sm:text-[11px] font-black outline-none cursor-pointer shadow-xs shrink-0"
                title="프로토 승부식 회차 직접 선택"
              >
                {dynamicMeta.G101.roundsList.map((ts) => (
                  <option key={ts} value={`프로토 승부식 ${ts}회차 (betman.co.kr 오피셜 슬립)`}>
                    {ts}회차
                  </option>
                ))}
              </select>
            </div>

            {/* ⚽ 축구 승무패 + 회차 선택 드롭다운 */}
            <div
              onClick={() => onSelectFolder('SEUNGMUBAE')}
              className={`col-span-1 w-full px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-between gap-1.5 border ${
                selectedFolder === 'SEUNGMUBAE'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span>⚽ 승무패</span>
              <select
                value={selectedFolder === 'SEUNGMUBAE' ? selectedRound : `축구 승무패 ${dynamicMeta.G011.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectFolder('SEUNGMUBAE');
                  onSelectRound(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400/80 rounded px-1 py-0.5 text-[9px] sm:text-[11px] font-black outline-none cursor-pointer shadow-xs shrink-0"
                title="축구 승무패 회차 직접 선택"
              >
                {dynamicMeta.G011.roundsList.map((ts) => (
                  <option key={ts} value={`축구 승무패 ${ts}회차 (betman.co.kr 오피셜 슬립)`}>
                    {ts}회차
                  </option>
                ))}
              </select>
            </div>

            {/* ⚾ 야구 승1패 + 회차 선택 드롭다운 */}
            <div
              onClick={() => onSelectFolder('SEUNG1PAE')}
              className={`col-span-1 w-full px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-between gap-1.5 border ${
                selectedFolder === 'SEUNG1PAE'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span>⚾ 승1패</span>
              <select
                value={selectedFolder === 'SEUNG1PAE' ? selectedRound : `야구 승1패 ${dynamicMeta.G024.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectFolder('SEUNG1PAE');
                  onSelectRound(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-400/80 rounded px-1 py-0.5 text-[9px] sm:text-[11px] font-black outline-none cursor-pointer shadow-xs shrink-0"
                title="야구 승1패 회차 직접 선택"
              >
                {dynamicMeta.G024.roundsList.map((ts) => (
                  <option key={ts} value={`야구 승1패 ${ts}회차 (betman.co.kr 오피셜 슬립)`}>
                    {ts}회차
                  </option>
                ))}
              </select>
            </div>

            {/* 🎯 프로토 기록식 + 회차 선택 드롭다운 */}
            <div
              onClick={() => onSelectFolder('GIROKSIK')}
              className={`col-span-1 w-full px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-between gap-1.5 border ${
                selectedFolder === 'GIROKSIK'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span>🎯 기록식</span>
              <select
                value={selectedFolder === 'GIROKSIK' ? selectedRound : `프로토 기록식 ${dynamicMeta.G102.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectFolder('GIROKSIK');
                  onSelectRound(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-purple-600 hover:bg-purple-700 text-white border border-purple-400/80 rounded px-1 py-0.5 text-[9px] sm:text-[11px] font-black outline-none cursor-pointer shadow-xs shrink-0"
                title="프로토 기록식 회차 직접 선택"
              >
                {dynamicMeta.G102.roundsList.map((ts) => (
                  <option key={ts} value={`프로토 기록식 ${ts}회차 (betman.co.kr 오피셜 슬립)`}>
                    {ts}회차
                  </option>
                ))}
              </select>
            </div>

            {/* 🏀 승5패 (준비중) */}
            <button
              onClick={() => onSelectFolder('SEUNG5PAE')}
              className={`col-span-2 md:col-span-1 w-full py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer border ${
                selectedFolder === 'SEUNG5PAE'
                  ? 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
                  : isLight ? 'text-slate-400 bg-slate-100 border-slate-200' : 'text-slate-500 hover:text-slate-300 bg-slate-900/40 border-slate-800/50'
              }`}
              title="현재 발매 시즌이 아닙니다 (다음 시즌 개장 예정)"
            >
              🏀 농구 승5패 (시즌 준비중)
            </button>

            {/* 🌐 전체포함 / ⏰ 진행예정만 */}
            <button
              onClick={() => setHidePassedMatches(!hidePassedMatches)}
              className={`col-span-1 w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                hidePassedMatches
                  ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-black' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
              title="한국시간(KST) 기준 지난 경기 숨김 토글"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{hidePassedMatches ? '⏰ 진행 예정만' : '🌐 전체 포함'}</span>
            </button>

            {/* 📊 정밀상세 / ⚡ 간편보기 */}
            <button
              onClick={() => setCardDensity(cardDensity === 'COMPACT' ? 'DETAILED' : 'COMPACT')}
              className={`col-span-1 w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                cardDensity === 'COMPACT'
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : isLight ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200' : 'text-slate-400 hover:text-white bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{cardDensity === 'COMPACT' ? '⚡ 간편보기' : '📊 정밀상세'}</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
