import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    } // This is the first time the input is rendered and I avoid validating it and the error message

    if (search.trim() === "") {
      setError("Please enter a search term");
      return;
    }

    if (search.length < 3) {
      setError("Please enter at least 3 characters");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    [getMovies]
  );
  // debouncedGetMovies is a function that is called only once every 300ms, debounce avoids calling the API too many times and search every time the user types a letter

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  };

  return (
    <div className="page">
      <header>
        <h1>Movie Browser</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="query"
            onChange={handleChange}
            type="text"
            value={search}
            placeholder="Avengers, Star Wars, The Matrix..."
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Search</button>
        </form>
        {error && (
          <p
            style={{ color: "red", borderColor: error ? "red" : "transparent" }}
          >
            {error}
          </p>
        )}
      </header>

      <main>{loading ? <p>Loading...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
