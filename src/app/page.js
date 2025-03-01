"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [searchZip, setSearchZip] = useState("");
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState({});
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ text: "", rating: 5, playgroundId: "" });

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

  const fetchReviews = async (playgroundId) => {
    const reviewsQuery = query(collection(db, `playgrounds/${playgroundId}/reviews`), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(reviewsQuery);
    const playgroundReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReviews(prev => ({ ...prev, [playgroundId]: playgroundReviews }));
  };

  const handleReviewSubmit = async (playgroundId) => {
    if (!newReview.text.trim()) return;

    await addDoc(collection(db, `playgrounds/${playgroundId}/reviews`), {
      name: "Anonymous", // Future: Replace with authenticated user
      rating: newReview.rating,
      comment: newReview.text,
      timestamp: serverTimestamp(),
    });

    setNewReview({ text: "", rating: 5, playgroundId: "" });
    fetchReviews(playgroundId); // Refresh reviews after submission
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
        {Object.values(filteredPlaygrounds).length > 0 ? (
          Object.values(filteredPlaygrounds).map(playground => (
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

              {/* Fetch & Display Reviews */}
              <button
                onClick={() => fetchReviews(playground.id)}
                className="mt-2 text-blue-600 underline"
              >
                Show Reviews
              </button>

              <div className="mt-3 space-y-2">
                {reviews[playground.id]?.map(review => (
                  <div key={review.id} className="border-t pt-2 text-sm">
                    <strong>{review.name}</strong>: {review.comment} <span className="text-yellow-500">⭐ {review.rating}/5</span>
                  </div>
                ))}
              </div>

              {/* Submit a Review */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Write a review..."
                  value={newReview.playgroundId === playground.id ? newReview.text : ""}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value, playgroundId: playground.id })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newReview.playgroundId === playground.id ? newReview.rating : 5}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value), playgroundId: playground.id })}
                  className="mt-2 px-3 py-1 border rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(star => (
                    <option key={star} value={star}>{star} ⭐</option>
                  ))}
                </select>
                <button
                  onClick={() => handleReviewSubmit(playground.id)}
                  className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Submit Review
                </button>
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
