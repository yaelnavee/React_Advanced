//TODO
/**
 * 1. figure out how to load only a few pictures at a time while scrolling
 * 2. add pictures
 * 3. delete, update pic
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Photos() {
  const { userId, albumId } = useParams();

  const [photos, setPhotos] = useState([]);

  const getPhotos = () => {
    fetch(`http://localhost:3000/photos?albumId=${albumId}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  };

  useEffect(() => {
    getPhotos();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "20px", color: "#2c3e50" }}>📸 Photos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              background: "#f5f5f5",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
            <div style={{ marginTop: "8px", fontSize: "14px", color: "#333" }}>
              {photo.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Photos;

