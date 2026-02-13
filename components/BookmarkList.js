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
    // Subscribe to real-time changes
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
          console.log('Realtime event received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              // Avoid duplicates
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
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from realtime');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Optimistically update UI
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        // Notify parent
        if (onBookmarkDeleted) {
          onBookmarkDeleted();
        }
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      // Refetch on error
      fetchBookmarks();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
        No bookmarks yet. Add your first one above!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {bookmark.url}
            </a>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
