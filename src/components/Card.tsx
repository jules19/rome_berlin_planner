"use client";

import type { Card as CardType } from "@/lib/supabase";

const CITY_COLORS = {
  berlin: "bg-purple-100 text-purple-800",
  rome: "bg-amber-100 text-amber-800",
} as const;

const CATEGORY_LABELS = {
  food: "🍕 Food",
  sight: "🏛️ Sight",
  activity: "🎯 Activity",
  nightlife: "🌙 Nightlife",
  stay: "🏨 Stay",
  transport: "🚇 Transport",
  other: "📌 Other",
} as const;

type CardProps = {
  card: CardType;
};

export function Card({ card }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      {card.image_url ? (
        <img
          src={card.image_url}
          alt={card.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-4xl">
            {card.category ? CATEGORY_LABELS[card.category]?.split(" ")[0] : "📍"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {card.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {card.city && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${CITY_COLORS[card.city]}`}
            >
              {card.city}
            </span>
          )}
          {card.category && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {CATEGORY_LABELS[card.category]}
            </span>
          )}
        </div>

        {/* Link */}
        {card.link_url && (
          <a
            href={card.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 truncate block"
          >
            {new URL(card.link_url).hostname.replace("www.", "")}
          </a>
        )}
      </div>
    </div>
  );
}
