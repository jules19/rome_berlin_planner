import { NextRequest, NextResponse } from "next/server";

type ScrapeResponse =
  | {
      success: true;
      data: {
        title: string;
        image: string | null;
      };
    }
  | {
      success: false;
      error: string;
      fallback: {
        title: string;
      };
    };

export async function POST(request: NextRequest): Promise<NextResponse<ScrapeResponse>> {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({
        success: false,
        error: "URL required",
        fallback: { title: "Link" },
      });
    }

    const domain = extractDomain(url);

    // Fetch with 5-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let html: string;
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; TripBoard/1.0; +https://tripboard.app)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `HTTP ${response.status}`,
          fallback: { title: domain },
        });
      }

      html = await response.text();
    } catch (fetchError) {
      clearTimeout(timeout);
      return NextResponse.json({
        success: false,
        error: fetchError instanceof Error ? fetchError.message : "Fetch failed",
        fallback: { title: domain },
      });
    }

    // Parse OG tags from HTML
    const ogData = parseOgTags(html);

    return NextResponse.json({
      success: true,
      data: {
        title: ogData.title || domain,
        image: ogData.image,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Unexpected error",
      fallback: { title: "Link" },
    });
  }
}

function parseOgTags(html: string): { title: string | null; image: string | null } {
  // Try og:title first (handles both attribute orders)
  const ogTitleMatch =
    html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);

  // Try og:image
  const ogImageMatch =
    html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

  // Fallback to <title> tag if no og:title
  const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

  // Decode HTML entities in title
  let title = ogTitleMatch?.[1] || titleTagMatch?.[1]?.trim() || null;
  if (title) {
    title = decodeHtmlEntities(title);
  }

  return {
    title,
    image: ogImageMatch?.[1] || null,
  };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return "Link";
  }
}
