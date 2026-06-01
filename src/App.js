import React, { useState, useEffect } from "react";

import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = "https://www.omdbapi.com?apikey=b6003d8a";
const DEFAULT_SEARCH = "Batman";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    searchMovies(DEFAULT_SEARCH);
  }, []);

  const searchMovies = async (title) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(trimmedTitle)}`);
      const data = await response.json();

      setMovies(data.Search || []);

      if (data.Response === "False") {
        setError(data.Error || "No movies found");
      }
    } catch (err) {
      setMovies([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>MovieLand</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading movies...</p>
        </div>
      ) : movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.imdbID} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>{error || "No movies found"}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
