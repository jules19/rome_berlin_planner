/**
 * URL detection and normalization utilities
 */

/**
 * Check if input looks like a URL
 */
export function isUrl(input: string): boolean {
  const trimmed = input.trim();

  // Must have some content
  if (!trimmed || trimmed.length < 4) {
    return false;
  }

  // Check for common URL patterns:
  // - Starts with http:// or https://
  // - Starts with www.
  // - Looks like domain.tld (at least 2 char TLD)
  const urlPattern =
    /^(https?:\/\/|www\.)|^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/;

  if (!urlPattern.test(trimmed)) {
    return false;
  }

  // Validate it's actually parseable as a URL
  try {
    const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize URL to ensure https:// prefix
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Extract domain name for fallback title
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return "Link";
  }
}
