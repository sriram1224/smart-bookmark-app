'use client';

import { useState } from 'react';

export default function AddBookmark({ userId, onBookmarkAdded }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, userId }),
      });

      if (response.ok) {
        setUrl('');
        setTitle('');
        if (onBookmarkAdded) {
          onBookmarkAdded();
        }
      } else {
        const error = await response.json();
        console.error('Error adding bookmark:', error);
        alert('Failed to add bookmark. Please try again.');
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('Failed to add bookmark. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-6 sm:mb-8 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-10 h-10 bg-[#A78BFA]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-base sm:text-lg font-medium text-slate-800">Add New Bookmark</h2>
      </div>
      
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Favorite Website"
            className="w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/30 focus:border-[#A78BFA] transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-[15px] sm:text-base"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/30 focus:border-[#A78BFA] transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-400 text-[15px] sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#A78BFA] to-[#6366F1] hover:from-[#9F7AEA] hover:to-[#5B5FC7] text-white font-medium py-3.5 sm:py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 text-[15px] sm:text-base"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Bookmark</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
