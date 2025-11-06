import { useFavorites } from "../context/FavoritesContext";
import "../allcss/FavoriteButton.css";

export default function FavoriteButton({ game }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(game.id);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      await removeFavorite(game.id);
    } else {
      await addFavorite({
        game_id: game.id,
        game_name: game.name,
        background_image: game.background_image,
      });
    }
  };

  return (
    <button
      className="btn btn-success"
      onClick={toggle}
      aria-label={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      {fav ? (
        <img src="/melasingola.png" alt="Preferito" />
      ) : (
        <img src="/melarossa.png" alt="Aggiungi" />
      )}
    </button>
  );
}
