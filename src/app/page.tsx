"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type Card } from "@/lib/supabase";
import { CardGrid } from "@/components/CardGrid";
import { AddCardForm } from "@/components/AddCardForm";
import { CardGridSkeleton } from "@/components/CardSkeleton";

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteCard = useCallback(async (id: string) => {
    if (!supabase) return;

    await supabase.from("cards").delete().eq("id", id);
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const fetchCards = useCallback(async () => {
    if (!supabase) {
      setError("Supabase not configured. Add credentials to .env.local");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCards(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-2xl">🇩🇪</span>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            Berlin + Rome
          </h1>
          <span className="text-2xl">🇮🇹</span>
        </div>
        <p className="text-gray-500 text-lg">Trip ideas from 4 friends</p>
      </header>

      {/* Add Card Form */}
      <div className="mb-8">
        <AddCardForm onCardAdded={fetchCards} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      {loading ? <CardGridSkeleton count={8} /> : <CardGrid cards={cards} onDelete={deleteCard} />}

      {/* Refresh button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchCards}
          className="inline-flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
    </main>
  );
}
