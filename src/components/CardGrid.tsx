"use client";

import type { Card as CardType } from "@/lib/supabase";
import { Card } from "./Card";

type CardGridProps = {
  cards: CardType[];
};

export function CardGrid({ cards }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No cards yet.</p>
        <p className="text-gray-400 mt-1">Add your first idea above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
