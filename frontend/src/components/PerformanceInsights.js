import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';

const PerformanceInsights = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getRecommendations();
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index} className="mb-2">
            <strong>{rec.topic}:</strong> {rec.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PerformanceInsights;