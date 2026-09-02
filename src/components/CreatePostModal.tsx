import React, { useState } from 'react';
import { X, Tag, Paperclip, Send } from 'lucide-react';
import type { Match, CommunityPost } from '../types/sports';

interface CreatePostModalProps {
  matches: Match[];
  onClose: () => void;
  onSubmitPost: (post: Partial<CommunityPost>) => void;
}

export const CreatePostModal = ({
  matches,
  onClose,
  onSubmitPost
}: CreatePostModalProps) => {
  const [category, setCategory] = useState<CommunityPost['category']>('FOOTBALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedMatchNo, setAttachedMatchNo] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmitPost({
      category,
      title: title.trim(),
      content: content.trim(),
      attachedMatchNo: attachedMatchNo || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✍️
            </div>
            <h2 className="text-base font-black text-white">오피셜 팩트 분석글 작성</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">카테고리 선택</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: 'FOOTBALL', label: '⚽ 축구 게시판' },
                { id: 'BASEBALL', label: '⚾ 야구 게시판' },
                { id: 'BASKETBALL', label: '🏀 농구 게시판' },
                { id: 'FREE', label: '💬 자유 수다' },
                { id: 'DATA_ANALYSIS', label: '📈 팩트 데이터분석' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    category === cat.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attach Match */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-emerald-400" /> 대상 경기 순번 첨부 (선택)
            </label>
            <select
              value={attachedMatchNo || ''}
              onChange={(e) => setAttachedMatchNo(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">-- 경기 선택 없음 --</option>
              {matches.map(match => (
                <option key={match.id} value={match.betmanMatchNo}>
                  [{match.betmanMatchNo}번] {match.homeTeam.name} vs {match.awayTeam.name} ({match.league})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">제목</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="분석글 제목을 입력하세요"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">내용 (오피셜 팩트 기반 수치, 폼, 체력 변수 등)</label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="최근 3경기 폼, 14일 체력 소모도, 선발 몸값 차이 등 팩트 기반 의견을 작성하세요..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-emerald-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> 태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예: 승무패15회차, 맨유, 체력신호등"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>등록하기</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
