"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Send, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
}

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      text: "Absolutely stunning visuals! One of the best movie experiences I've had in a long time.",
      date: "2 hours ago",
      likes: 12
    },
    {
      id: "2",
      user: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "The pacing was a bit slow in the second act, but the ending made up for it. Highly recommend!",
      date: "5 hours ago",
      likes: 8
    }
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      text: newComment,
      date: "Just now",
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Reviews & Comments</h2>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-muted uppercase tracking-widest leading-none">
          {comments.length} Comments
        </div>
      </div>

      <div className="space-y-12">
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-6 group">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white/5 ring-1 ring-white/10 bg-[#1a1c26]">
            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="Avatar" width={48} height={48} />
          </div>
          <div className="flex-1 space-y-4">
             <div className="relative">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  className="w-full bg-[#1a1c26]/60 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-white/10 transition-all placeholder:text-muted min-h-[120px] resize-none"
                />
                <div className="absolute bottom-4 right-4">
                   <Button type="submit" size="sm" className="h-10 px-5 gap-2 font-bold rounded-xl shadow-lg shadow-primary/20">
                      <Send className="w-4 h-4" />
                      Post Comment
                   </Button>
                </div>
             </div>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-10">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-6 group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white/5 ring-1 ring-white/10 bg-[#1a1c26]">
                <Image src={comment.avatar} alt={comment.user} width={48} height={48} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white tracking-tight">{comment.user}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="text-xs font-bold text-muted uppercase tracking-widest">{comment.date}</span>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed text-sm max-w-2xl">
                  {comment.text}
                </p>
                <div className="flex items-center gap-6 pt-1">
                   <button className="flex items-center gap-2 text-muted hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{comment.likes} Likes</span>
                   </button>
                   <button className="flex items-center gap-2 text-muted hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Reply</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
