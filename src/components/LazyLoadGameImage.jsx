import "../allcss/LazyLoadGameImage.css";
export default function LazyLoadGameImage({ src, alt }) {
  return (
    <img src={src} alt={alt} loading="lazy" className="style-game-image" />
  );
}
