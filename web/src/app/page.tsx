"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import entries from '../data/all_entries.json';

interface Entry {
  word: string;
  translation: string;
  audio_url?: string | null;
}

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredEntries = search
    ? entries.filter((entry: Entry) =>
        entry.word.toLowerCase().includes(search.toLowerCase()) ||
        entry.translation.toLowerCase().includes(search.toLowerCase()))
    : [];

  const playAudio = (url?: string | null) => {
    if (url && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Tuvan-English Dictionary</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Tuvan or English..."
        className="w-full border px-4 py-2 rounded-lg shadow-sm mb-6"
      />

      {search && filteredEntries.length === 0 && (
        <p className="text-gray-600">No entries found.</p>
      )}

      <ul className="space-y-4">
        {filteredEntries.map((entry: Entry, idx: number) => (
          <li key={idx} className="border p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                <Link href={`/entries/${encodeURIComponent(entry.word)}`} className="hover:underline text-blue-600">
                  {entry.word}
                </Link>
              </h2>
              <p className="text-gray-600">{entry.translation}</p>
            </div>
            {entry.audio_url && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={() => playAudio(entry.audio_url)}
              >
                🔊 Listen
              </button>
            )}
          </li>
        ))}
      </ul>

      <audio ref={audioRef} />
    </div>
  );
};

export default Dictionary;
