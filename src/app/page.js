"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [searchZip, setSearchZip] = useState("");
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState([]);

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      const querySnapshot = await getDocs(collection(db, "playgrounds"));
      const playgroundData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaygrounds(playgroundData);
      setFilteredPlaygrounds(playgroundData);
    };

    fetchPlaygrounds();
  }, []);

  const handleSearch = () => {
    if (searchZip.trim() === "") {
      setFilteredPlaygrounds(playgrounds);
    } else {
      const filtered = playgrounds.filter(p => p.zip === searchZip.trim());
      setFilteredPlaygrounds(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Playground Directory</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter ZIP Code"
          value={searchZip}
          onChange={(e) => setSearchZip(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Playground Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaygrounds.length > 0 ? (
          filteredPlaygrounds.map(playground => (
            <div key={playground.id} className="bg-white p-4 shadow rounded">
              <img src={playground.image} alt={playground.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{playground.name}</h2>
              <p className="text-gray-600">{playground.location}</p>
              <p className="text-sm text-gray-500">ZIP: {playground.zip}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No playgrounds found for this ZIP code.</p>
        )}
      </div>
    </div>
  );
}
