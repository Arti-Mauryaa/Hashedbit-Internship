import movies from "../data/movies";
import MovieCard from "../components/MovieCard";

function Movies() {
  return (
    <div>
      <h1>Movie Booking App</h1>

      <div className="movies-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Movies;