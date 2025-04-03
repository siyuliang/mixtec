"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
// import csvData from '../../../data/mixtec.csv';

interface Entry {
  word: string;
  ipa: string;
  english: string;
}

const entries: Entry[] = csvData.map((row) => ({
  word: row.Word || '',
  ipa: row.IPA || '',
  english: row.English || '',
}));

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredEntries = search
    ? entries.filter((entry: Entry) =>
        entry.word.toLowerCase().includes(search.toLowerCase()) ||
        entry.english.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Mixtec-English Dictionary</h1>
      <input 
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Mixtec or English..."
        className="w-full border px-4 py-2 rounded-lg shadow-sm mb-6"
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
              <p className="text-gray-500">[{entry.ipa}]</p>
              <p className="text-gray-600">{entry.english}</p>
            </Link>
          </li>
        ))}
      </ul>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default Dictionary;