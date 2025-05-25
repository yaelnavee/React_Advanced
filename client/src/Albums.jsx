
// //TODO
// /**
//  * 1. add id to album display----------------------------
//  * 2. add search by id or title
//  * 3. add album-------------------------------------------
//  * 4. photos---------------------------------------------
//  */
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Albums() {
  const userId = 1;
  const [albums, setAlbums] = useState([]);
  const [nextId, setNextId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const navigate=useNavigate()

  const getAlbums = () => {
    fetch(`http://localhost:3000/albums?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setAlbums(data));

    fetch(`http://localhost:3000/albums`)
      .then((res) => res.json())
      .then((data) =>
        setNextId((Number(data[data.length - 1].id) + 1).toString())
      );
  };

  useEffect(() => {
    getAlbums();
  }, []);

  const handleClickAlbum = (id) => {
    localStorage.setItem("album", id)
    navigate('/photos')
  };

  const addAlbum = async () => {
    if (!newTitle.trim()) return;

    const newAlbum = {
      userId: userId,
      id: nextId,
      title: newTitle,
    };

    await fetch("http://localhost:3000/albums", {
      method: "POST",
      body: JSON.stringify(newAlbum),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    setShowPopup(false);
    setNewTitle("");
    getAlbums();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "20px", color: "#2c3e50" }}>🎵 Albums</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            style={{
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "500",
              fontSize: "16px",
              minHeight: "100px",
              cursor: "pointer",
            }}
            onClick={() => handleClickAlbum(album.id)}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "5px" }}>
              #{album.id}
            </div>
            <div>{album.title}</div>
          </div>
        ))}

        {/* Plus Card */}
        <div
          style={{
            border: "2px dashed #bbb",
            borderRadius: "10px",
            minHeight: "100px",
            padding: "20px",
            color: "#888",
            fontSize: "36px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
          }}
          onClick={() => setShowPopup(true)}
        >
          +
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            width: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h3 style={{ margin: 0 }}>Add New Album</h3>
            <input
              type="text"
              placeholder="Album title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ padding: "8px", fontSize: "14px" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowPopup(false)} style={{ padding: "6px 12px" }}>Cancel</button>
              <button onClick={addAlbum} style={{ padding: "6px 12px", backgroundColor: "#2575fc", color: "#fff", border: "none", borderRadius: "4px" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Albums;

