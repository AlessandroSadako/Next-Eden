import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchSolution from "../../hooks/useFetchSolution";
import "../../allcss/SearchPage.css";
import CardGame from "../../components/CardGame";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const q = (searchParams.get("query") || "").trim();
  const genre = (searchParams.get("genre") || "").trim();
  const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;

  const buildUrl = (q, genre) => {
    const usp = new URLSearchParams();
    usp.set("key", RAWG_KEY);
    usp.set("page", "1");
    if (q) usp.set("search", q);
    if (genre) usp.set("genres", genre);
    return `https://api.rawg.io/api/games?${usp.toString()}`;
  };

  const { data, loading, error, setUrl } = useFetchSolution(buildUrl(q, genre));

  useEffect(() => {
    setUrl(buildUrl(q, genre));
  }, [q, genre, setUrl]);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Risultati ricerca</h2>

      {loading && <p className="text-gold-dark">Caricamento…</p>}
      {error && <p className="text-danger">Errore: {error}</p>}

      <div className="row">
        {data?.results?.map((game) => (
          <div key={game.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <CardGame game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
