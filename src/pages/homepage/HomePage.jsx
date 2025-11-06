import { useState } from "react";
import "../../allcss/HomePage.css";
import useFetchSolution from "../../hooks/useFetchSolution";
import CardGame from "../../components/CardGame";

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState("");

  const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;

  const genresUrl = `/rawg/genres?key=${RAWG_KEY}`;
  const {
    data: genres,
    loading: loadingGenres,
    error: errorGenres,
  } = useFetchSolution(genresUrl);

  const gamesUrl = selectedGenre
    ? `/rawg/games?key=${RAWG_KEY}&genres=${selectedGenre}`
    : `/rawg/games?key=${RAWG_KEY}`;
  const {
    data: games,
    loading: loadingGames,
    error: errorGames,
  } = useFetchSolution(gamesUrl);

  return (
    <div className="style-homepage">
      {games?.results?.map((game) => (
        <CardGame key={game.id} game={game} />
      ))}
    </div>
  );
}
