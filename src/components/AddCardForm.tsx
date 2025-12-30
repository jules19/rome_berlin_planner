"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isUrl, normalizeUrl, extractDomain } from "@/lib/url-utils";

type AddCardFormProps = {
  onCardAdded: () => void;
};

const CATEGORIES = [
  { value: "food", label: "🍕 Food" },
  { value: "sight", label: "🏛️ Sight" },
  { value: "activity", label: "🎯 Activity" },
  { value: "nightlife", label: "🌙 Nightlife" },
  { value: "stay", label: "🏨 Stay" },
  { value: "transport", label: "🚇 Transport" },
  { value: "other", label: "📌 Other" },
];

export function AddCardForm({ onCardAdded }: AddCardFormProps) {
  const [input, setInput] = useState("");
  const [city, setCity] = useState<"" | "berlin" | "rome">("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Background enrichment - doesn't block UI
  async function enrichCard(cardId: string, url: string) {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Update card with enriched data
        await supabase
          .from("cards")
          .update({
            title: result.data.title,
            image_url: result.data.image,
          })
          .eq("id", cardId);

        // Refresh grid to show updated card
        onCardAdded();
      }
      // If scrape fails, card keeps its placeholder title (domain name)
    } catch (err) {
      // Silent failure - card exists with domain name
      console.error("Enrichment failed:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setIsSubmitting(true);
    setError(null);

    // Detect if input is a URL
    const inputIsUrl = isUrl(trimmedInput);
    const normalizedUrl = inputIsUrl ? normalizeUrl(trimmedInput) : null;
    const cardTitle = inputIsUrl ? extractDomain(normalizedUrl!) : trimmedInput;

    // Insert card immediately
    const { data: insertedCard, error: insertError } = await supabase
      .from("cards")
      .insert({
        title: cardTitle,
        city: city || null,
        category: category || null,
        link_url: normalizedUrl,
      })
      .select("id")
      .single();

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Reset form and refresh grid
    setInput("");
    setCity("");
    setCategory("");
    setIsExpanded(false);
    onCardAdded();

    // If URL, trigger background enrichment (fire-and-forget)
    if (inputIsUrl && insertedCard?.id) {
      enrichCard(insertedCard.id, normalizedUrl!);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Main input row - always visible */}
      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste a link or type an idea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors placeholder:text-gray-400"
            required
          />
          <button
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity min-w-[80px] flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>

      {/* Expanded options */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* City toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button
                type="button"
                onClick={() => setCity(city === "berlin" ? "" : "berlin")}
                className={`px-4 py-2.5 text-sm font-semibold transition-all min-w-[100px] ${
                  city === "berlin"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                🇩🇪 Berlin
              </button>
              <button
                type="button"
                onClick={() => setCity(city === "rome" ? "" : "rome")}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-l border-gray-200 min-w-[100px] ${
                  city === "rome"
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                🇮🇹 Rome
              </button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setCategory(category === cat.value ? "" : cat.value)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.value
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Collapse button */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="px-4 pb-4">
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}
