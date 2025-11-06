import "../allcss/UploadAvatar.css";

export default function UploadAvatar({ onSelect }) {
  return (
    <div className="vstack gap-2">
      <label htmlFor="profile-avatar-file" className="form-label">
        Avatar
      </label>
      <input
        id="profile-avatar-file"
        type="file"
        accept="image/*"
        className="form-control"
        onChange={(e) => onSelect?.(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
