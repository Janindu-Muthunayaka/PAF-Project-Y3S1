import React, { useState } from 'react';

const CreatePlan = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    completed: '',
    resourceFileUrls: [],
    videoFileUrls: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceFiles = (e) => {
    setFormData(prev => ({ ...prev, resourceFileUrls: Array.from(e.target.files) }));
  };

  const handleVideoFiles = (e) => {
    setFormData(prev => ({ ...prev, videoFileUrls: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      completed: formData.completed === 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const form = new FormData();
    form.append('data', JSON.stringify(payload));

    formData.resourceFileUrls.forEach(file => form.append('resourceFiles', file));
    formData.videoFileUrls.forEach(file => form.append('videoFiles', file));

    try {
      const res = await fetch('http://localhost:8080/api/plans', {
        method: 'POST',
        body: form,
      });
      if (res.ok) {
        alert('Plan created successfully!');
      } else {
        alert('Failed to create plan');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Create a New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <textarea
            name="name"
            rows="2"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="completed"
            value={formData.completed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select status</option>
            <option value="Not completed">Not completed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Resource Files</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleResourceFiles}
            className="w-full border rounded-lg p-2"
          />
          <p className="text-sm text-gray-500 mt-1">Drag and drop your PDF, DOC here.</p>
        </div>

        <div>
          <label className="block font-semibold mb-2">Video Files</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoFiles}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
