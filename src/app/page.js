"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState([]);

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      const querySnapshot = await getDocs(collection(db, "playgrounds"));
      const playgroundData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaygrounds(playgroundData);
    };

    fetchPlaygrounds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Playground Directory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playgrounds.map(playground => (
          <div key={playground.id} className="bg-white p-4 shadow rounded">
            <img src={playground.image} alt={playground.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{playground.name}</h2>
            <p className="text-gray-600">{playground.location}</p>
            <p className="text-sm text-gray-500">ZIP: {playground.zip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
