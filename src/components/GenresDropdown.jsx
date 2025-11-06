import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import useFetchSolution from "../hooks/useFetchSolution";
import "../allcss/GenresDropdown.css";

export default function GenresDropdown() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;
  const { data, loading, error } = useFetchSolution(
    `/rawg/genres?key=${RAWG_KEY}`
  );

  const currentQuery = (searchParams.get("query") || "").trim();
  const currentGenre = (searchParams.get("genre") || "").trim();

  const handleChange = (e) => {
    const slug = e.target.value;
    const params = {};
    if (currentQuery) params.query = currentQuery;
    if (slug) params.genre = slug;

    navigate({
      pathname: "/search",
      search: createSearchParams(params).toString(),
    });
  };

  if (loading) return <p className="mb-0">Caricamento generi…</p>;
  if (error) return <p className="text-danger mb-0">{error}</p>;

  return (
    <div className="mb-3">
      <label htmlFor="genre-select" className="form-label">
        Filtri
      </label>
      <select
        id="genre-select"
        name="genre"
        className="form-select"
        value={currentGenre}
        onChange={handleChange}
      >
        <option value="">Tutti i generi</option>
        {data?.results?.map((g) => (
          <option key={g.id} value={g.slug}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
