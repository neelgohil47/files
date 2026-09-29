import { useEffect, useState } from "react";
import { fetchNews, CATEGORIES } from "./api";
import NewsCard from "./NewsCard";

function Skeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card skeleton">
          <div className="img placeholder" />
          <div className="body">
            <div className="line short" />
            <div className="line" />
            <div className="line" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("general");
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchNews({ category, query, signal: controller.signal })
      .then((list) => {
        setArticles(list);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong.");
        setArticles([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [category, query, retry]);

  const onSearch = (e) => {
    e.preventDefault();
    setQuery(input.trim());
  };

  const pickCategory = (c) => {
    setCategory(c);
    setQuery("");
    setInput("");
  };

  const [first, ...rest] = articles;

  return (
    <div className="app">
      <header className="top">
        <div className="bar">
          <h1 className="brand">Daybreak</h1>
          <form className="search" onSubmit={onSearch} role="search">
            <input
              type="search"
              placeholder="Search news"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Search news"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <nav className="tabs" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={!query && c === category ? "tab active" : "tab"}
              onClick={() => pickCategory(c)}
            >
              {c}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <h3 className="heading">
          {query ? `Results for "${query}"` : `Top headlines: ${category}`}
        </h3>

        {loading && <Skeleton />}

        {!loading && error && (
          <div className="state">
            <p>{error}</p>
            <button onClick={() => setRetry((n) => n + 1)}>Try again</button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="state">
            <p>No articles found. Try a different search or category.</p>
          </div>
        )}

        {!loading && !error && first && (
          <>
            <NewsCard article={first} featured />
            <div className="grid">
              {rest.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer>News from GNews API</footer>
    </div>
  );
}
