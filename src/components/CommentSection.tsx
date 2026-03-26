"use client";

import { useState } from "react";
import { Heart, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  hearts: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    user: "Aria Thorne",
    avatar: "AT",
    content: "The way the author described the setting here gave me chills. Absolutely stunning prose.",
    timestamp: "2 hours ago",
    hearts: 45
  },
  {
    id: "2",
    user: "Julian V.",
    avatar: "JV",
    content: "I did not see that plot twist coming! Need the next chapter immediately.",
    timestamp: "5 hours ago",
    hearts: 12
  }
];

interface CommentSectionProps {
  hasTopComment?: boolean;
}

export default function CommentSection({ hasTopComment = false }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="max-w-2xl mx-auto w-full mt-24 mb-16 border-t border-crimson/10 pt-16 px-6 md:px-0">
      <div className="flex items-center space-x-3 mb-12">
        <MessageSquare className="text-crimson" size={24} />
        <h3 className="text-2xl font-serif font-bold text-crimson">The Discussion</h3>
      </div>
      
      {/* Input */}
      <div className="mb-12 relative">
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full bg-white border border-crimson/20 rounded-2xl p-6 text-crimson placeholder:text-crimson/40 outline-none resize-none min-h-[120px] transition-all focus:border-crimson focus:ring-4 focus:ring-crimson/5 focus:shadow-[0_0_15px_rgba(153,0,0,0.08)]"
        ></textarea>
        <button className="absolute bottom-4 right-4 p-3 bg-crimson text-white rounded-xl hover:bg-crimson/90 transition-colors shadow-sm shadow-crimson/20 flex items-center space-x-2">
          <span className="text-sm font-semibold tracking-wide">Post</span>
          <Send size={16} />
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {MOCK_COMMENTS.map((comment, index) => {
          const isTopComment = hasTopComment && index === 0;
          return (
            <div key={comment.id} className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 border border-crimson/20">
                <span className="text-sm font-bold text-crimson font-serif">{comment.avatar}</span>
              </div>
              <div className={`flex-1 bg-white border p-5 shadow-sm transition-shadow ${
                isTopComment 
                  ? "border-crimson/30 rounded-2xl shadow-[0_0_20px_rgba(153,0,0,0.05)] bg-crimson/[0.02]" 
                  : "border-crimson/5 rounded-2xl rounded-tl-none hover:shadow-[0_4px_15px_rgba(153,0,0,0.05)]"
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-crimson">{comment.user}</span>
                    {isTopComment && (
                      <span className="px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">Top Comment</span>
                    )}
                  </div>
                  <span className="text-xs text-crimson/50 font-medium">{comment.timestamp}</span>
                </div>
                <p className="text-crimson/80 text-sm leading-relaxed mb-4">{comment.content}</p>
                <button className="flex items-center space-x-1.5 text-crimson/60 hover:text-crimson transition-colors cursor-pointer w-fit group">
                  <Heart size={14} className={`transition-all ${isTopComment ? 'fill-crimson/20 text-crimson' : 'group-hover:fill-crimson'}`} />
                  <span className="text-xs font-bold">{comment.hearts}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
