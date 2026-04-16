"use client";
import { useState } from "react";
import Link from "next/link";

export default function DogProfile() {
  const [dogData, setDogData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "reutje",
    sterilized: "nee",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier komt straks de koppeling met je database (Supabase/Convex)
    console.log("Data opgeslagen:", dogData);
    alert("Profiel bijgewerkt!");
  };

  return (
    <div className="profile-container">
      <style>{`
        .profile-container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
        .back-link { color: #6B6B8A; text-decoration: none; font-size: 14px; display: block; margin-bottom: 20px; }
        h1 { font-family: 'Syne', sans-serif; font-size: 28px; margin-bottom: 8px; }
        p { color: #6B6B8A; margin-bottom: 30px; }
        
        form { display: flex; flex-direction: column; gap: 20px; background: #F9FAFB; padding: 30px; border-radius: 24px; border: 1px solid #F3F4F6; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 14px; font-weight: 600; color: #1A1A2E; }
        input, select { 
          padding: 12px; border-radius: 10px; border: 1px solid #E5E7EB; 
          font-family: inherit; font-size: 16px; outline: none; transition: border-color 0.2s;
        }
        input:focus { border-color: #4FC3F7; }
        
        .btn-save { 
          background: #1A1A2E; color: white; padding: 16px; border-radius: 12px; 
          font-weight: 700; border: none; cursor: pointer; font-size: 16px; margin-top: 10px;
        }
        .btn-save:hover { opacity: 0.9; }
      `}</style>

      <Link href="/dashboard" className="back-link">
        ← Terug naar Dashboard
      </Link>

      <h1>Hondenprofiel 🐾</h1>
      <p>Vul de gegevens van je hond in voor nauwkeurigere diagnoses.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Naam van je hond</label>
          <input
            type="text"
            placeholder="Bijv. Buddy"
            value={dogData.name}
            onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label>Ras</label>
          <input
            type="text"
            placeholder="Bijv. Golden Retriever"
            value={dogData.breed}
            onChange={(e) => setDogData({ ...dogData, breed: e.target.value })}
            required
          />
        </div>

        <div
          className="input-group"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}>
          <div>
            <label>Leeftijd (jaar)</label>
            <input
              type="number"
              placeholder="0"
              value={dogData.age}
              onChange={(e) => setDogData({ ...dogData, age: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Gewicht (kg)</label>
            <input
              type="number"
              placeholder="0"
              value={dogData.weight}
              onChange={(e) =>
                setDogData({ ...dogData, weight: e.target.value })
              }
            />
          </div>
        </div>

        <div className="input-group">
          <label>Geslacht</label>
          <select
            value={dogData.gender}
            onChange={(e) =>
              setDogData({ ...dogData, gender: e.target.value })
            }>
            <option value="reutje">Reutje</option>
            <option value="teefje">Teefje</option>
          </select>
        </div>

        <div className="input-group">
          <label>Gecastreerd / Gesteriliseerd?</label>
          <select
            value={dogData.sterilized}
            onChange={(e) =>
              setDogData({ ...dogData, sterilized: e.target.value })
            }>
            <option value="nee">Nee</option>
            <option value="ja">Ja</option>
          </select>
        </div>

        <button type="submit" className="btn-save">
          Profiel Opslaan
        </button>
      </form>
    </div>
  );
}
