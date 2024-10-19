import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user-profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more user information as needed */}
      </div>
    </div>
  );
};

export default Profile;