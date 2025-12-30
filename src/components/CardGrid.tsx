"use client";

import type { Card as CardType } from "@/lib/supabase";
import { Card } from "./Card";

type CardGridProps = {
  cards: CardType[];
  onDelete?: (id: string) => void;
};

export function CardGrid({ cards, onDelete }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        {/* Animated illustration */}
        <div className="text-6xl mb-6 animate-bounce">
          <span>🗺️</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Start your adventure
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          Paste a link from Google Maps, Instagram, or anywhere. Your idea
          becomes a card the whole group can see.
        </p>

        {/* Hint pointing up to form */}
        <div className="flex justify-center text-gray-300">
          <span className="text-2xl animate-pulse">👆</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <Card key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
}
