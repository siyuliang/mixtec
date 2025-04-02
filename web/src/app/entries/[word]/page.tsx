import React from 'react';
import Link from 'next/link';
import entries from '../../../data/all_entries.json';
import { Metadata } from 'next';

interface Entry {
    word: string;
    translation: string;
    audio_url?: string | null;
  }

// NOTE: params is now a Promise due to Next.js 15 async APIs
type Props = {
  params: Promise<{ word: string }>;
};

// This must be async and await params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = entries.find((entry: Entry) => entry.word === decodedWord);

  return entry
    ? {
        title: entry.word,
        description: entry.translation,
      }
    : {
        title: 'Entry not found',
        description: 'The requested entry could not be found.',
      };
}

// Page component must also await params
export default async function Page({ params }: Props) {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = entries.find((entry: Entry) => entry.word === decodedWord);

  if (!entry) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-lg text-gray-600 mb-4">Entry not found.</p>
        <Link href="/" className="text-blue-500 underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Link href="/" className="text-blue-500 underline">
        ← Back to search
      </Link>

      <h1 className="text-4xl font-bold mt-4 mb-2">{entry.word}</h1>
      <p className="text-2xl text-gray-700 mb-6">{entry.translation}</p>

      {entry.audio_url && (
        <audio controls className="w-full">
          <source src={entry.audio_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
