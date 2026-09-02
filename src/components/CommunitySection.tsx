import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, PlusCircle, Search, Send } from 'lucide-react';
import type { CommunityPost } from '../types/sports';

interface CommunitySectionProps {
  posts: CommunityPost[];
  onOpenCreatePost: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommunitySection = ({
  posts,
  onOpenCreatePost,
  onLikePost,
  onAddComment
}: CommunitySectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Category Bar & Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: '전체' },
            { id: 'FOOTBALL', label: '⚽ 축구' },
            { id: 'BASEBALL', label: '⚾ 야구' },
            { id: 'BASKETBALL', label: '🏀 농구' },
            { id: 'FREE', label: '💬 자유수다' },
            { id: 'DATA_ANALYSIS', label: '📈 팩트 분석' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Write Action */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 키워드 검색..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>
          <button
            onClick={onOpenCreatePost}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>글쓰기</span>
          </button>
        </div>
      </div>

      {/* Post List Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
            등록된 분석글이 없습니다. 첫 번째 팩트 분석글을 작성해보세요! ✍️
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all shadow-lg space-y-4"
              >
                {/* Top Meta Info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{post.authorName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          팩트 리포터 📊
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        작성일: {post.createdAt}
                      </span>
                    </div>
                  </div>

                  {post.attachedMatchNo && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                      📌 [{post.attachedMatchNo}번 경기 분석]
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="font-bold text-white text-base hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                >
                  {post.title}
                </h3>

                {/* Content preview or full */}
                <div className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {isExpanded ? post.content : post.content.slice(0, 180) + (post.content.length > 180 ? '...' : '')}
                  {post.content.length > 180 && (
                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="ml-2 text-emerald-400 font-bold hover:underline inline-block"
                    >
                      {isExpanded ? '접기' : '더보기'}
                    </button>
                  )}
                </div>

                {/* Tags & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60 text-xs">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Likes & Comments Count */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 transition-colors font-bold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>댓글 {post.commentsCount}</span>
                    </button>

                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Eye className="w-3.5 h-3.5" /> {post.views}
                    </span>
                  </div>
                </div>

                {/* Comments Section (Expanded) */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> 댓글 ({post.comments.length})
                    </h4>

                    {/* Comment List */}
                    <div className="space-y-2">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 font-bold text-white">
                              <span>{comment.authorAvatar}</span>
                              <span>{comment.authorName}</span>
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                                {comment.authorBadge}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-slate-300 font-medium">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder="의견이나 팩트 추가 댓글을 입력하세요..."
                        className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>작성</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
