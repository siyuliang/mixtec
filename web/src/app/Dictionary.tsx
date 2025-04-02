"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import entries from '../data/all_entries.json';

interface Entry {
    word: string;
    translation: string;
    audio_url?: string | null;
  }  

const Dictionary = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const query = router.query.search as string;
    if (query) {
      setSearch(query);
    }
  }, [router.query.search]);

  useEffect(() => {
    if (search) {
      router.replace({
        pathname: router.pathname,
        query: { search },
      });
    } else {
      router.replace(router.pathname);
    }
  }, [search, router]);

  const filteredEntries = search
    ? entries.filter((entry: Entry) => {
        const query = search.toLowerCase();
        return (
          entry.word.toLowerCase().includes(query) ||
          entry.translation.toLowerCase().includes(query)
        );
      }).slice(0, 20) // Limit results to 20 for better UX
    : [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Tuvan-English Dictionary</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Tuvan or English words..."
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {!search && (
        <p className="text-center text-gray-600">Type to search the dictionary.</p>
      )}

      {search && filteredEntries.length === 0 && (
        <p className="text-center text-gray-600">No results found.</p>
      )}

      <ul className="space-y-3">
        {filteredEntries.map((entry: Entry, idx: number) => (
          <li key={idx} className="border p-3 rounded-lg hover:bg-gray-50">
            <Link href={`/entries/${encodeURIComponent(entry.word)}`} className="block">
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {entry.word}
              </h2>
              <p className="text-gray-600">{entry.translation}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dictionary;
