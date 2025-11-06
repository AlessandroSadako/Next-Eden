import { Link } from "react-router-dom";
import LazyLoadGameImage from "./LazyLoadGameImage";
import "../allcss/CardGame.css";
import FavoriteButton from "./FavoriteButton";

export default function CardGame({ game }) {
  const genres = game.genres?.map((g) => g.name).join(", ") || "Sconosciuti";

  return (
    <div className="card h-100 cardgame-card">
      {/* Immagine */}
      <div className="position-relative">
        <LazyLoadGameImage
          src={game.background_image}
          alt={game.name || "game"}
        />
        <img src="/nextedenlogo.png" alt="logo" className="cardgame-logo" />
      </div>

      {/* Corpo card */}
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
          <Link to={`/games/${game.id}`} className="btn btn-success px-4">
            Scopri di più
          </Link>
          <div className="mx-1">
            <FavoriteButton game={game} />
          </div>
        </div>
      </div>
    </div>
  );
}

// const CardGame = ({ game }) => {
//   const genres =
//     game.genres?.map((genre) => genre.name).join(", ") || "Sconosciuti";
//   console.log(game);
//   return (
//     <div className="card text-light h-100 cardgame-card">
//       {/* Immagine */}
//       <div className="position-relative">
//         <img
//           src={game.background_image}
//           className="card-img-top cardgame-img"
//           alt={game.name || "game"}
//         />
//         <img src="/nextedenlogo.png" alt="logo" className="cardgame-logo" />
//       </div>
//       {/* Corpo card */}
//       <div className="card-body d-flex flex-column">
//         <h5 className="card-title">{game.name}</h5>
//         <p className="card-text mb-1">
//           <strong>Generi: </strong>
//           <em>{genres}</em>
//         </p>
//         <p className="card-text">
//           <small className="text-muted">{game.released}</small>
//         </p>

//         <div className="cardgame-footer">
//           <Link
//             to={`/games/${game.genres?.[0]?.slug || "unknown"}`}
//             className="btn btn-success px-4"
//           />{" "}
//           Scopri di piu
//         </div>
//       </div>
//     </div>
