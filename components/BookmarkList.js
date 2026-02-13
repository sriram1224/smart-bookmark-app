'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function BookmarkList({ userId, refreshTrigger, onBookmarkDeleted }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/bookmarks?userId=${userId}`);
      const data = await response.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId, refreshTrigger]);

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              if (prev.some(b => b.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        if (onBookmarkDeleted) {
          onBookmarkDeleted();
        }
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      fetchBookmarks();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#A78BFA] border-t-transparent mx-auto mb-4"></div>
        <p className="text-slate-600 text-[15px]">Loading your bookmarks...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-2">No bookmarks yet</h3>
        <p className="text-slate-500 text-sm sm:text-[15px] leading-relaxed">Start by adding your first bookmark above</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-sm sm:text-base font-medium text-slate-700">
          Your Bookmarks <span className="text-slate-400 font-normal">({bookmarks.length})</span>
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <div className="w-1.5 h-1.5 bg-[#6EE7B7] rounded-full animate-pulse"></div>
          <span className="text-[12px] sm:text-[13px]">Live</span>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-5">
        {bookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="group bg-white p-4 sm:p-6 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 animate-fade-in active:scale-[0.98]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F3F0FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-slate-800 text-sm sm:text-base truncate">{bookmark.title}</h3>
                </div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] sm:text-[14px] text-[#6366F1] hover:text-[#5B5FC7] flex items-center gap-1.5 truncate transition-colors duration-200 ml-[42px] sm:ml-[52px]"
                >
                  <span className="truncate">{bookmark.url}</span>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-2 sm:mt-3 ml-[42px] sm:ml-[52px]">
                  {new Date(bookmark.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(bookmark.id)}
                className="flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-[#F87171] p-2 sm:px-3 sm:py-2 rounded-lg text-sm font-normal transition-all duration-300 hover:bg-red-50 flex items-center gap-1.5 active:scale-90"
              >
                <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline text-[13px]">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
