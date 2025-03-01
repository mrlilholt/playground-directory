"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">Find Your Perfect Playground</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter ZIP Code"
          value={searchZip}
          onChange={(e) => setSearchZip(e.target.value)}
          className="px-4 py-2 w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Search
        </button>
      </div>

      {/* Playground Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaygrounds.length > 0 ? (
          filteredPlaygrounds.map(playground => (
            <div
              key={playground.id}
              className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={playground.image}
                alt={playground.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-2xl font-bold mt-4 text-blue-800">{playground.name}</h2>
              <p className="text-gray-600">{playground.location}</p>
              <p className="text-sm text-gray-500">ZIP: {playground.zip}</p>

              {/* Features Tags */}
<div className="flex flex-wrap mt-3">
  {(Array.isArray(playground.features) ? playground.features : []).map((feature, index) => (
    <span
      key={index}
      className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-3 py-1 rounded-full"
    >
      {feature}
    </span>
  ))}
</div>

            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No playgrounds found for this ZIP code.</p>
        )}
      </div>
    </div>
  );
}
