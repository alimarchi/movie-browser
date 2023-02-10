import { useState, useRef, useMemo, useCallback } from "react";
import { searchMovies } from "../services/movies";

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevSearch = useRef(search);
  // useRef is a reference that persists between renders

  const getMovies = useCallback(async ({search}) => {

    if (search === prevSearch.current) return;
    // if the search term is the same as the previous search term, don't run the function again
    try {
      setLoading(true);
      setError(null);
      prevSearch.current = search;
      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
    } catch (error) {
      setError(error.message);
    }finally {
      // finally will always run, regardless of whether the try block succeeds or fails
      setLoading(false);
    }

  }, []);

  const sortedMovies = useMemo(() => {
    return sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
  }, [movies, sort]);
  // executes the function only when the movies or sort state changes with useMemo hook, which is a performance optimization

  return { movies: sortedMovies, getMovies, loading };
}
