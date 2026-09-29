import { useState } from "react";

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function CardImage({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="img placeholder" aria-hidden="true" />;
  return (
    <img className="img" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
  );
}

export default function NewsCard({ article, featured = false }) {
  return (
    <a
      className={featured ? "card featured" : "card"}
      href={article.url}
      target="_blank"
      rel="noreferrer"
    >
      <CardImage src={article.image} />
      <div className="body">
        <p className="meta">
          {article.source.name}, {timeAgo(article.publishedAt)}
        </p>
        <h2>{article.title}</h2>
        <p className="desc">{article.description}</p>
      </div>
    </a>
  );
}
