"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type Card } from "@/lib/supabase";
import { CardGrid } from "@/components/CardGrid";
import { AddCardForm } from "@/components/AddCardForm";

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trip Board</h1>
        <p className="text-gray-500 mt-1">Berlin + Rome ideas</p>
      </header>

      {/* Add Card Form */}
      <div className="mb-8">
        <AddCardForm onCardAdded={fetchCards} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <CardGrid cards={cards} />
      )}

      {/* Refresh hint */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchCards}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ↻ Refresh to see updates
        </button>
      </div>
    </main>
  );
}
