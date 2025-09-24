import React from "react";
import NewsCard from "./NewsCard";

function NewsList({ news }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {news.map((n) => (
        <NewsCard
          key={n.id}
          id={n.id}
          title={n.title}
          description={n.description}
          category={n.category} 
          image={n.image}
          created_at={n.created_at}
          view={n.view}
          is_trending={n.is_trending}
        />
      ))}
    </div>
  );
}

export default NewsList;
