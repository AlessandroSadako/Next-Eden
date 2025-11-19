import { useFavorites } from "../context/FavoritesContext";
import { useToasts } from "../context/ToastsContext";
import "../allcss/FavoriteButton.css";

export default function FavoriteButton({ game }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { success, info, error } = useToasts();
  const fav = isFavorite(game.id);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (fav) {
        await removeFavorite(game.id);
        info(`Rimosso dai preferiti: ${game.name}`);
      } else {
        await addFavorite({
          game_id: game.id,
          game_name: game.name,
          background_image: game.background_image,
        });
        success(`Aggiunto ai preferiti: ${game.name}`);
      }
    } catch (e) {
      error("Operazione non riuscita");
    }
  };

  return (
    <button
      className="btn btn-outline-primary favorite-btn"
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
