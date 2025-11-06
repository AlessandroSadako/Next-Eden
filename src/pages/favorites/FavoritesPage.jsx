import { useFavorites } from "../../context/FavoritesContext";
import "../../allcss/FavoritePage.css";

export default function FavoritesPage() {
  const { favorites, loading, removeFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="container py-4">
        <p>Caricamento preferiti…</p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">I miei preferiti</h2>
        <p>Non hai ancora aggiunto nessun gioco ai preferiti.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">I miei preferiti</h2>

      <div className="row g-3">
        {favorites.map((f) => (
          <div
            key={f.game_id || f.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div className="card h-100">
              {f.background_image && (
                <img
                  src={f.background_image}
                  className="card-img-top favorite-card-image"
                  alt={f.game_name}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{f.game_name}</h6>
                <button
                  className="btn btn-sm btn-outline-danger mt-auto"
                  onClick={() => removeFavorite(f.game_id)}
                >
                  Rimuovi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
