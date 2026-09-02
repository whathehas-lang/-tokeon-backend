import React from 'react';
import { Award, Trophy, ShieldCheck, Flame, LogOut } from 'lucide-react';

export interface UserProfileData {
  id: string;
  name: string;
  tier: string;
  accuracy: number;
  totalVotes: number;
  correctVotes: number;
  favoriteSport: string;
  badges: string[];
}

interface UserProfileModalProps {
  userProfile: UserProfileData;
  onLogout?: () => void;
}

export const UserProfileModal = ({ userProfile, onLogout }: UserProfileModalProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 shadow-xl shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
              🎟️
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-black text-white">{userProfile.name}</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 오피셜 팩트 분석가 🏅
              </span>
            </div>

            <p className="text-xs text-slate-400">
              주요 분석 분야: <strong className="text-slate-200">{userProfile.favoriteSport}</strong> | 회원 가입일: 2026.01.15
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              {userProfile.badges.map((b: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Accuracy Score Card & Logout Action */}
          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center shrink-0 w-full sm:w-auto shadow-inner">
              <span className="text-[11px] font-bold text-slate-400 block">팩트 적중 신뢰도</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {userProfile.accuracy}%
              </div>
              <span className="text-[11px] text-emerald-400 font-bold block mt-1">상위 1% 팩트 리포터</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>계정 로그아웃</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Profile Analytics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 text-center">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <span className="text-slate-400 font-bold block">총 참가 팩트 투표</span>
          <span className="text-xl font-black text-white">{userProfile.totalVotes}회</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <span className="text-slate-400 font-bold block">정확한 적중 수치</span>
          <span className="text-xl font-black text-emerald-400">{userProfile.correctVotes}회</span>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 text-center">
          <Flame className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <span className="text-slate-400 font-bold block">VVIP 팩트 마스터 등급</span>
          <span className="text-xl font-black text-amber-300">100% 팩트 인증</span>
        </div>
      </div>
    </div>
  );
};
