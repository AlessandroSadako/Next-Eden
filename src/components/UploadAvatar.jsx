import "../allcss/UploadAvatar.css";
import { useRef, forwardRef, useImperativeHandle } from "react";

const UploadAvatar = forwardRef(({ onSelect }, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      inputRef.current?.click();
    },
  }));

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => onSelect?.(e.target.files?.[0] ?? null)}
    />
  );
});

UploadAvatar.displayName = "UploadAvatar";

export default UploadAvatar;
