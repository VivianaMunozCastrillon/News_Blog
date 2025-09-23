import React from "react";
import NewsCard from "./NewsCard";


function NewsList({ news }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          created_at={item.created_at}
          view={item.view}
          is_trending={item.is_trending}
        />
      ))}
    </div>
  );


}



export default NewsList;
