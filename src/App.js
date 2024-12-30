import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ id: "", isbn: "", title: "", director: { firstname: "", lastname: "" } });
  const [editing, setEditing] = useState(false);

  const API_BASE_URL = "http://localhost:8000/movies";

  // Fetch movies on load
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_BASE_URL}/${form.id}`, form);
    } else {
      await axios.post(API_BASE_URL, form);
    }
    fetchMovies();
    setForm({ id: "", isbn: "", title: "", director: { firstname: "", lastname: "" } });
    setEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleEdit = (movie) => {
    setForm(movie);
    setEditing(true);
  };

  return (
    <div className="app">
      <h1>Movie Manager</h1>
      <form className="movie-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Director First Name"
          value={form.director.firstname}
          onChange={(e) => setForm({ ...form, director: { ...form.director, firstname: e.target.value } })}
          required
        />
        <input
          type="text"
          placeholder="Director Last Name"
          value={form.director.lastname}
          onChange={(e) => setForm({ ...form, director: { ...form.director, lastname: e.target.value } })}
          required
        />
        <button type="submit">{editing ? "Update Movie" : "Add Movie"}</button>
      </form>
      <div className="movie-list">
        {movies.map((movie) => (
          <div className="movie-item" key={movie.id}>
            <h3>{movie.title}</h3>
            <p>
              <strong>ISBN:</strong> {movie.isbn}
            </p>
            <p>
              <strong>Director:</strong> {movie.director.firstname} {movie.director.lastname}
            </p>
            <button onClick={() => handleEdit(movie)}>Edit</button>
            <button onClick={() => handleDelete(movie.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
