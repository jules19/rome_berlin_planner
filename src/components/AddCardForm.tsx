"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type AddCardFormProps = {
  onCardAdded: () => void;
};

const CATEGORIES = [
  { value: "", label: "Category (optional)" },
  { value: "food", label: "🍕 Food" },
  { value: "sight", label: "🏛️ Sight" },
  { value: "activity", label: "🎯 Activity" },
  { value: "nightlife", label: "🌙 Nightlife" },
  { value: "stay", label: "🏨 Stay" },
  { value: "transport", label: "🚇 Transport" },
  { value: "other", label: "📌 Other" },
];

export function AddCardForm({ onCardAdded }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState<"" | "berlin" | "rome">("");
  const [category, setCategory] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("cards").insert({
      title: title.trim(),
      city: city || null,
      category: category || null,
      link_url: linkUrl.trim() || null,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Reset form
    setTitle("");
    setCity("");
    setCategory("");
    setLinkUrl("");
    onCardAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col gap-3">
        {/* Title input */}
        <input
          type="text"
          placeholder="What's the idea? (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />

        {/* Link input */}
        <input
          type="url"
          placeholder="Link URL (optional)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* City and Category row */}
        <div className="flex gap-3">
          {/* City toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setCity(city === "berlin" ? "" : "berlin")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                city === "berlin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Berlin
            </button>
            <button
              type="button"
              onClick={() => setCity(city === "rome" ? "" : "rome")}
              className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                city === "rome"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Rome
            </button>
          </div>

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>
    </form>
  );
}
