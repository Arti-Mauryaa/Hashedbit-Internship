import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="card">
      <img src={movie.image} alt={movie.title} />

      <h3>{movie.title}</h3>

      <Link to={`/movie/${movie.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default MovieCard;