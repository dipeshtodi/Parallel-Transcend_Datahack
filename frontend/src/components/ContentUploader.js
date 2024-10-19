import React, { useState } from 'react';
import api from '../services/api';

const ContentUploader = () => {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !topic) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('topic', topic);

    try {
      await api.post('/upload-content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Content uploaded successfully!');
      setFile(null);
      setTopic('');
    } catch (error) {
      console.error('Error uploading content:', error);
      alert('Error uploading content. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-4">Upload Content</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
};

export default ContentUploader;