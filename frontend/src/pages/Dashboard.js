import React from 'react';
import PerformanceInsights from '../components/PerformanceInsights';
import ContentUploader from '../components/ContentUploader';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <PerformanceInsights />
      <ContentUploader />
    </div>
  );
};

export default Dashboard;