
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Photos() {
  const navigate=useNavigate()
  const { userId, albumId } = useParams();
  const hasLoadedInitial = useRef(false);

  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const photosPerPage = 6;
  const [hasMore, setHasMore] = useState(true);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const getPhotos = () => {
    fetch(
      `http://localhost:3000/photos?albumId=${albumId}&_start=${
        page * photosPerPage
      }&_limit=${photosPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPhotos((prev) => [...prev, ...data]);
        if (data.length < photosPerPage) {
          setHasMore(false);
        }
      });
  };

  useEffect(() => {
    if (!hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      getPhotos();
    }
  }, []);

  useEffect(() => {
    if (page === 0) return;
    getPhotos();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setEditedTitle(photo.title);
  };

  const handleSaveTitle = async () => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((p) =>
        p.id === selectedPhoto.id ? { ...p, title: editedTitle } : p
      )
    );
    setSelectedPhoto(null);

    const newPhoto = {
      albumId: albumId,
      id: selectedPhoto.id,
      title: editedTitle,
      url: selectedPhoto.url,
      thumbnailUrl: selectedPhoto.thumbnailUrl,
    };

    await fetch(`http://localhost:3000/photos/${selectedPhoto.id}`, {
      method: "PUT",
      body: JSON.stringify(newPhoto),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const handleDelete = async (photoId) => {
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));

    try {
      await fetch(`http://localhost:3000/photos/${photoId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  const handleAddPhoto = () => {
    navigate(`/users/${userId}/albums/${albumId}/photos/addphotos`);
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#2c3e50",
        }}
      >
        📸 Photos
      </h1>

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
            onClick={() => handlePhotoClick(photo)}
            style={{
              position: "relative",
              background: "#f5f5f5",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo.id);
              }}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                color: "#e74c3c",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
              title="Delete"
            >
              ✕
            </button>

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

        {/* Add Photo Button */}
        <div
          onClick={handleAddPhoto}
          style={{
            background: "#ecf0f1",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "36px",
            color: "#7f8c8d",
            cursor: "pointer",
            minHeight: "150px",
          }}
        >
          +
        </div>
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h3>Edit Title</h3>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTitle}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Photos;
