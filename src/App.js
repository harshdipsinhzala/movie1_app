import React, { useState, useEffect, useRef } from "react";

import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = "https://www.omdbapi.com?apikey=b6003d8a";
const DEFAULT_SEARCH = "Batman";
const CACHE_KEY = "movie-search-cache";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const cacheRef = useRef({});
  const requestIdRef = useRef(0);

  useEffect(() => {
    try {
      cacheRef.current = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (err) {
      cacheRef.current = {};
    }

    searchMovies(DEFAULT_SEARCH);
  }, []);

  const saveToCache = (key, value) => {
    cacheRef.current[key] = value;

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheRef.current));
    } catch (err) {
      // Ignore storage limits and keep the in-memory cache for this tab.
    }
  };

  const searchMovies = async (title) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || isLoading) return;

    const cacheKey = trimmedTitle.toLowerCase();
    const cachedResult = cacheRef.current[cacheKey];

    if (cachedResult) {
      setMovies(cachedResult.movies);
      setError(cachedResult.error);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(trimmedTitle)}`);
      const data = await response.json();

      if (requestId !== requestIdRef.current) return;

      const nextMovies = data.Search || [];
      const nextError = data.Response === "False" ? data.Error || "No movies found" : "";

      setMovies(nextMovies);
      setError(nextError);
      saveToCache(cacheKey, { movies: nextMovies, error: nextError });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setMovies([]);
      setError("Something went wrong. Please try again.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const hasMovies = movies?.length > 0;

  return (
    <div className="app">
      <h1>MovieLand</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchMovies(searchTerm);
          }}
          placeholder="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          className={isLoading ? "is-loading" : ""}
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {isLoading && hasMovies && <p className="search-status">Updating results...</p>}

      {hasMovies ? (
        <div className={isLoading ? "container container-loading" : "container"}>
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.imdbID} />
          ))}
        </div>
      ) : isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading movies...</p>
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
