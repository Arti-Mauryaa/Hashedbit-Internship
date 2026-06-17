import { useParams, Link } from "react-router-dom";
import movies from "../data/movies";

function MovieDetails() {
  const { id } = useParams();

  const movie = movies.find((m) => m.id === Number(id));

  return (
    <div className="details">
      <img src={movie.image} alt={movie.title} />

      <h2>{movie.title}</h2>

      <p>{movie.description}</p>

      <Link to="/book">
        <button>Book Seat</button>
      </Link>
    </div>
  );
}

export default MovieDetails;