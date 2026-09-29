const API_KEY = "af0e84c9c2f57c7f813b018ba037c1e9";
const BASE_URL = "https://gnews.io/api/v4";

export const CATEGORIES = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

// Fetches articles from GNews.
// If `query` is set it uses the Search endpoint, otherwise Top Headlines.
export async function fetchNews({ category = "general", query = "", signal } = {}) {
  const url = query
    ? `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&max=12&apikey=${API_KEY}`
    : `${BASE_URL}/top-headlines?category=${category}&lang=en&max=12&apikey=${API_KEY}`;

  const res = await fetch(url, { signal });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.join(" ") || `Request failed (${res.status})`);
  }
  return data.articles || [];
}
