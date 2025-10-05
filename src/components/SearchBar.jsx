import React from "react";
import { useSearch } from "../context/SearchContext";
import { Search } from "lucide-react";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Buscar noticias..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  );
};

export default SearchBar;
