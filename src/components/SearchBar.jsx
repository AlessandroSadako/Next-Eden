import "../allcss/SearchBar.css";

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="d-flex gap-2 mb-3"
      role="search"
      noValidate
    >
      <label htmlFor="search-games-input" className="visually-hidden">
        Cerca
      </label>
      <input
        id="search-games-input"
        name="q"
        className="form-control"
        type="search"
        placeholder="Cerca giochi…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn btn-outline-primary">Cerca</button>
    </form>
  );
}
