import GenresDropdown from "./GenresDropdown";
import "../allcss/Sidebar.css";

export default function Sidebar() {
  return (
    <div>
      <h5 className="mb-3">Filtri</h5>
      <GenresDropdown />
    </div>
  );
}
