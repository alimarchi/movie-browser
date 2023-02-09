import "./App.css";
import { useState, useEffect, useRef } from "react";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    } // This is the first time the input is rendered and I avoid validating it and the error message

    if (search === "") {
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
  const { search, updateSearch, error } = useSearch();
  const { movies } = useMovies({search});
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ search });
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
  };

  return (
    <div className="page">
      <header>
        <h1>Movie Browser</h1>
        <form className="form">
          <input
            name="query"
            onChange={handleChange}
            type="text"
            placeholder="Avengers, Star Wars, The Matrix..."
          />
          <button onClick={handleSubmit} type="submit">
            Search
          </button>
        </form>
        {error && (
          <p style={{ color: "red", borderColor: error ? "red" : "transparent" }}>
            {error}
          </p>
        )}
      </header>

      <main>
        <Movies movies={movies} />
      </main>
    </div>
  );
}

export default App;
