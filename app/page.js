'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import BookmarkList from '@/components/BookmarkList';
import AddBookmark from '@/components/AddBookmark';
import { useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookmarkAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBookmarkDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#A78BFA] border-t-transparent mx-auto mb-4"></div>
          <p className="text-base text-slate-600 font-normal">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 py-8">
        <div className="text-center max-w-md w-full">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#A78BFA]/20 to-[#6366F1]/20 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium mb-3 text-slate-800 tracking-tight">
              Smart Bookmark
            </h1>
            <p className="text-slate-600 text-base mb-2 leading-relaxed px-4">Save and organize your favorite links</p>
            <p className="text-slate-500 text-sm leading-relaxed px-4">Real-time sync across all your devices</p>
          </div>
          
          <button
            onClick={() => signIn('google')}
            className="group w-full bg-white hover:bg-slate-50 text-slate-700 font-normal py-4 px-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-[15px]">Continue with Google</span>
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6 text-sm text-slate-500 flex-wrap px-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"></div>
              <span>Real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              <span>Private</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#A78BFA]/20 to-[#6366F1]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-slate-800 tracking-tight truncate">
              My Bookmarks
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#A78BFA] to-[#6366F1] rounded-full flex items-center justify-center text-white text-sm font-medium">
                {session.user.email[0].toUpperCase()}
              </div>
              <span className="text-sm text-slate-500 font-normal max-w-[150px] truncate">{session.user.email}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-slate-600 hover:text-slate-800 px-3 sm:px-4 py-2 rounded-lg text-sm font-normal transition-colors duration-200 hover:bg-slate-100 active:scale-95"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-8">
        <AddBookmark userId={session.user.id} onBookmarkAdded={handleBookmarkAdded} />
        <BookmarkList userId={session.user.id} refreshTrigger={refreshTrigger} onBookmarkDeleted={handleBookmarkDeleted} />
      </main>
    </div>
  );
}
