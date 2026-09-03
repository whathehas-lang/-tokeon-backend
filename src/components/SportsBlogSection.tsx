import React, { useState } from 'react';
import { BookOpen, Edit3, Heart, MessageCircle, Share2, Tag, Trophy, Sparkles, TrendingUp, Search, User, Clock, ChevronRight } from 'lucide-react';
import type { Match } from '../types/sports';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorBadge: string;
  category: 'PREVIEW' | 'COLUMN' | 'PICK' | 'STRATEGY';
  categoryLabel: string;
  summary: string;
  content: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  relatedMatch?: string;
  tags: string[];
}

interface SportsBlogSectionProps {
  matches: Match[];
  theme?: 'light' | 'dark';
  onSelectMatch?: (match: Match) => void;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: '⚾ [MLB 정밀 프리뷰] 피츠버그 폴 스킨스 vs SF 로건 웹, 마운드 탈삼진 격돌',
    author: '팩트사이언스',
    authorBadge: '👑 VVIP 수석분석관',
    category: 'PREVIEW',
    categoryLabel: '정밀 프리뷰',
    summary: 'ERA 1.96의 괴물 루키 폴 스킨스와 샌프란시스코의 에이스 로건 웹(ERA 3.46)의 1차전 선발 맞대결. 양 팀 불펜 3연전 피로도와 득점 분기점을 분석합니다.',
    content: '피츠버그의 폴 스킨스는 최근 5경기에서 평균 6.2이닝을 소화하며 95구 내외의 안정적인 피칭을 이어가고 있습니다. 반면 샌프란시스코의 로건 웹 역시 지난 2일전 경기에서 98구를 던진 바 있으나 탄탄한 싱커 제구력을 자랑합니다. 기준점 8.5점 기준 저득점 투수전 양상이 예상됩니다.',
    createdAt: '방금 전',
    likes: 42,
    commentsCount: 15,
    relatedMatch: 'Pittsburgh Pirates vs San Francisco Giants',
    tags: ['MLB', '폴스킨스', '로건웹', '언더오버']
  },
  {
    id: 'post-2',
    title: '⚽ [유럽 축구 xG 칼럼] 툴루즈 vs 릴 : 파이널 서드 장악력과 박스 안 슈팅 비중',
    author: '데이터풋볼러',
    authorBadge: '⚡ 데이터마스터',
    category: 'COLUMN',
    categoryLabel: '데이터 칼럼',
    summary: 'xG 기대득점 1.65 vs 1.30, 필드 틸트 54% 우세를 점한 툴루즈의 홈 어드밴티지 포인트와 릴의 역습 전환 속도 비교.',
    content: '오피셜 xG 데이터에 따르면 툴루즈는 홈 경기 시 박스 안 유효 슈팅 비중이 65%에 달합니다. 릴의 최근 수비 전환 속도가 다소 떨어진 점을 감안할 때 툴루즈의 1골차 승부 우세가 점쳐집니다.',
    createdAt: '1시간 전',
    likes: 38,
    commentsCount: 9,
    relatedMatch: 'Toulouse vs Lille',
    tags: ['리그앙', 'xG분석', '툴루즈', '릴']
  },
  {
    id: 'post-3',
    title: '⚾ [KBO 빅매치] 롯데 박세웅 vs 한화 류현진 : 노림수와 피로도 총정리',
    author: '빅데이터KBO',
    authorBadge: '🎖️ 공인분석가',
    category: 'PICK',
    categoryLabel: '승부처 PICK',
    summary: '한화 류현진(ERA 3.87)의 노련한 볼 배합과 롯데 박세웅(ERA 4.45)의 이닝이터 승부. 불펜 필승조 소모 현황 분석.',
    content: '양 팀 모두 월요일 공식 휴식일을 거쳐 불펜 체력이 100% 충전된 상태입니다. 선발 류현진의 체인지업 제구가 초반 스트라이크존을 선점할 경우 한화의 투수전 우세가 유력합니다.',
    createdAt: '3시간 전',
    likes: 71,
    commentsCount: 24,
    relatedMatch: 'Lotte Giants vs Hanwha Eagles',
    tags: ['KBO', '류현진', '박세웅', '마운드분석']
  }
];

export const SportsBlogSection: React.FC<SportsBlogSectionProps> = ({
  matches,
  theme = 'dark',
  onSelectMatch
}) => {
  const isLight = theme === 'light';
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchWord, setSearchWord] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New post state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'PREVIEW' | 'COLUMN' | 'PICK' | 'STRATEGY'>('COLUMN');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredPosts = posts.filter(p => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchSearch = searchWord.trim() === '' ||
      p.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchWord.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchWord.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      author: '나의 스포츠노트',
      authorBadge: '👑 멤버스 회원',
      category: newCategory,
      categoryLabel: newCategory === 'PREVIEW' ? '정밀 프리뷰' : newCategory === 'COLUMN' ? '데이터 칼럼' : newCategory === 'PICK' ? '승부처 PICK' : '전술 전략',
      summary: newContent.trim().substring(0, 100) + '...',
      content: newContent.trim(),
      createdAt: '방금 전',
      likes: 1,
      commentsCount: 0,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsWriteModalOpen(false);
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border shadow-xl overflow-hidden ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      {/* 🏷️ 블로그 헤더 */}
      <div className={`p-3.5 sm:p-4 border-b shrink-0 flex items-center justify-between ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs sm:text-sm font-bold tracking-tight">스포츠 분석 블로그</h2>
        </div>
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 cursor-pointer transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>글쓰기</span>
        </button>
      </div>

      {/* 🔍 검색 및 카테고리 필터 */}
      <div className={`p-3 border-b space-y-2 shrink-0 ${
        isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
      }`}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="팀명, 선수명, 분석 키워드 검색..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none transition-all ${
              isLight ? 'bg-white border-slate-200 focus:border-emerald-500 text-slate-900' : 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-slate-100'
            }`}
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium">
          {[
            { id: 'ALL', label: '전체' },
            { id: 'PREVIEW', label: '경기 프리뷰' },
            { id: 'COLUMN', label: '데이터 칼럼' },
            { id: 'PICK', label: '승부처 PICK' },
            { id: 'STRATEGY', label: '베팅 전략' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer font-bold ${
                activeCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📜 블로그 피드 목록 (스크롤) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] shadow-sm ${
              isLight
                ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md text-slate-900'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {post.categoryLabel}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{post.createdAt}</span>
              </div>
            </div>

            <h3 className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug mb-1 ${
              isLight ? 'text-slate-900 hover:text-emerald-600' : 'text-slate-100 hover:text-emerald-400'
            }`}>
              {post.title}
            </h3>

            <p className={`text-xs line-clamp-2 mb-2.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {post.summary}
            </p>

            <div className={`flex items-center justify-between pt-2 border-t text-[11px] ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{post.author}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                }`}>
                  {post.authorBadge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center gap-1 text-rose-500 hover:scale-110 transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                  <span className="font-mono text-xs font-bold">{post.likes}</span>
                </button>
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📖 상세 글 열람 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {selectedPost.categoryLabel}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedPost.title}</h2>

            <div className="flex items-center justify-between text-xs text-slate-500 border-b pb-2 border-slate-200 dark:border-slate-800">
              <span>작성자: {selectedPost.author} ({selectedPost.authorBadge})</span>
              <span>{selectedPost.createdAt}</span>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {selectedPost.content}
            </div>

            {selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedPost.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✍️ 글 작성 모달 */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreatePost} className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                <span>스포츠 분석 칼럼 / 블로그 글 등록</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-bold text-slate-500 dark:text-slate-400">카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                >
                  <option value="PREVIEW">경기 프리뷰</option>
                  <option value="COLUMN">데이터 칼럼</option>
                  <option value="PICK">승부처 PICK</option>
                  <option value="STRATEGY">베팅 전략</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-500 dark:text-slate-400">글 제목</label>
                <input
                  type="text"
                  placeholder="분석글 제목을 입력하세요..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-500 dark:text-slate-400">분석 내용</label>
                <textarea
                  placeholder="경기 관전 포인트, 투수/타선 분석, 전술 등을 자유롭게 작성하세요..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 custom-scrollbar"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-500 dark:text-slate-400">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="MLB, 야구, 승부예측"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-bold"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
