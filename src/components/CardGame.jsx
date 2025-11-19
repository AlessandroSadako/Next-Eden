import { Link } from "react-router-dom";
import LazyLoadGameImage from "./LazyLoadGameImage";
import "../allcss/CardGame.css";
import FavoriteButton from "./FavoriteButton";

export default function CardGame({ game }) {
  const genres = game.genres?.map((g) => g.name).join(", ") || "Sconosciuti";

  return (
    <div className="card h-100 cardgame-card">
      <div className="position-relative">
        <LazyLoadGameImage
          src={game.background_image}
          alt={game.name || "game"}
        />
        <img src="/nextedenlogo.png" alt="logo" className="cardgame-logo" />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{game.name}</h5>
        <p className="card-text mb-1">
          <strong>Generi: </strong>
          <em>{genres}</em>
        </p>
        {game.released && (
          <p className="card-text">
            <small>{game.released}</small>
          </p>
        )}

        <div className="cardgame-footer">
          <Link to={`/games/${game.id}`} className="btn btn-primary px-4">
            Dettagli
          </Link>
          <div className="mx-1">
            <FavoriteButton game={game} />
          </div>
        </div>
      </div>
    </div>
  );
}
