"use client";

import type { Card as CardType } from "@/lib/supabase";

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
  onDelete?: (id: string) => void;
};

export function Card({ card, onDelete }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group relative">
      {/* Delete button - shows on hover */}
      {onDelete && (
        <button
          onClick={() => onDelete(card.id)}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete card"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Image - takes ~60% of card */}
      <div className="relative">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.title}
            className="w-full h-48 sm:h-52 object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-52 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform">
              {card.category ? CATEGORY_LABELS[card.category]?.split(" ")[0] : "📍"}
            </span>
          </div>
        )}

        {/* City badge overlaid on image */}
        {card.city && (
          <div className="absolute bottom-2 left-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize backdrop-blur-sm ${
                card.city === "berlin"
                  ? "bg-purple-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {card.city === "berlin" ? "🇩🇪" : "🇮🇹"} {card.city}
            </span>
          </div>
        )}
      </div>

      {/* Compact content area */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 min-h-[2.5rem]">
          {card.title}
        </h3>

        {/* Category as subtle pill */}
        {card.category && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
            {CATEGORY_LABELS[card.category]}
          </span>
        )}

        {/* Link with icon */}
        {card.link_url && (
          <a
            href={card.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 min-h-[44px] -mb-2"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="truncate">
              {new URL(card.link_url).hostname.replace("www.", "")}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
