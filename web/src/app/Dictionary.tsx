"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface Entry {
  word: string;
  orthography: string;
  ipa: string;
  english: string;
  spanish: string;
  tone: string;
  partOfSpeech: string;
  semanticDomain: string;
}

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('English'); // Default to English
  const [entries, setEntries] = useState<Entry[]>([]);
  const [semanticDomain, setSemanticDomain] = useState(''); // Selected semantic domain
  const [partOfSpeech, setPartOfSpeech] = useState(''); // Selected part of speech
  const [domains, setDomains] = useState<string[]>([]); // List of unique semantic domains
  const [partsOfSpeech, setPartsOfSpeech] = useState<string[]>([]); // List of unique parts of speech

  useEffect(() => {
    // Load and parse the CSV file
    fetch('/data/mixtec.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        const parsedEntries = parsed.data.map((row: any) => ({
          word: row.Word,
          orthography: row['Orthography w/ tones'],
          ipa: row.IPA,
          english: row.English,
          spanish: row.Spanish,
          tone: row['Tone Melody'],
          partOfSpeech: row['Part of Speech'],
          semanticDomain: row['Semantic Domain'],
        }));
  
        setEntries(parsedEntries);
  
        // Extract unique semantic domains
        const uniqueDomains = Array.from(
          new Set(parsedEntries.map((entry: Entry) => entry.semanticDomain))
        ).filter((domain) => domain); // Remove empty values
        setDomains(uniqueDomains);
  
        // Extract unique parts of speech
        const uniquePartsOfSpeech = Array.from(
          new Set(parsedEntries.map((entry: Entry) => entry.partOfSpeech))
        ).filter((pos) => pos); // Remove empty values
        setPartsOfSpeech(uniquePartsOfSpeech);
      })
      .catch(error => {
        console.error("Error loading dictionary data:", error);
        // You might want to set an error state here to display to the user
      });
  }, []);
  
  const filteredEntries = entries.filter((entry: Entry) => {
    const query = search.toLowerCase();

    // Match based on the selected search language
    const matchesSearch =
      searchLanguage === 'Mixtec'
        ? entry.word.toLowerCase().includes(query)
        : searchLanguage === 'English'
        ? entry.english.toLowerCase().includes(query)
        : searchLanguage === 'Spanish'
        ? entry.spanish.toLowerCase().includes(query)
        : false; // No matches if no language is selected

    const matchesDomain = semanticDomain
      ? entry.semanticDomain === semanticDomain
      : true;

    const matchesPartOfSpeech = partOfSpeech
      ? entry.partOfSpeech === partOfSpeech
      : true;

    return matchesSearch && matchesDomain && matchesPartOfSpeech;
  }).slice(0, 20); // Limit results to 20 for better UX

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Mixtec Dictionary</h1>

      <div className="mb-6">
        <label htmlFor="searchLanguage" className="block text-gray-700 font-medium mb-2">
          Searching in:
        </label>
        <select
          id="searchLanguage"
          value={searchLanguage}
          onChange={(e) => setSearchLanguage(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Mixtec">Mixtec</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Type your search query in ${searchLanguage}...`}
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!searchLanguage} // Disable input if no language is selected
      />

      <select
        value={semanticDomain}
        onChange={(e) => setSemanticDomain(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Semantic Domains</option>
        {domains.map((domain, idx) => (
          <option key={idx} value={domain}>
            {domain}
          </option>
        ))}
      </select>

      <select
        value={partOfSpeech}
        onChange={(e) => setPartOfSpeech(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Parts of Speech</option>
        {partsOfSpeech.map((pos, idx) => (
          <option key={idx} value={pos}>
            {pos}
          </option>
        ))}
      </select>

      {!search && !semanticDomain && !partOfSpeech && (
        <p className="text-center text-gray-600">
          Select a language to search and use the filters above.
        </p>
      )}

      {filteredEntries.length === 0 && (
        <p className="text-center text-gray-600">No results found.</p>
      )}

      <ul className="space-y-3">
        {filteredEntries.map((entry: Entry, idx: number) => (
          <li key={idx} className="border p-4 rounded-lg hover:bg-gray-50">
            <div className="grid grid-cols-1 gap-2">
              <h2 className="text-xl font-semibold text-blue-600">
                {entry.word}
              </h2>
              <p className="text-gray-500">{entry.ipa} • {entry.tone}</p>
              <p className="text-gray-700">Orthography: {entry.orthography}</p>
              <p className="text-gray-700">Part of Speech: {entry.partOfSpeech}</p>
              <p className="text-gray-700">Semantic Domain: {entry.semanticDomain}</p>
              <p className="text-gray-700">English: {entry.english}</p>
              <p className="text-gray-700">Spanish: {entry.spanish}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dictionary;