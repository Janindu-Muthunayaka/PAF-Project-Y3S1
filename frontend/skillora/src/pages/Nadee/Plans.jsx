import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/ish/UserContext';

const CreatePlan = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    completed: false,
    url: '', // Add URL field
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/plans', formData, {
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id, // Include user.id here
        },
      });
      if (response.status === 200 || response.status === 201) {
        alert('Plan created successfully!');
        navigate('/learning-plans/view');
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Create a New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="block font-semibold text-center mb-1">Name</label>
          <textarea
            name="name"
            rows="2"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl placeholder-gray-400"
            placeholder="Enter the plan name"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block font-semibold text-center mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl placeholder-gray-400"
            placeholder="Enter the plan description"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block font-semibold text-center mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl placeholder-gray-400"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="block font-semibold text-center mb-1">Status</label>
          <select
            name="completed"
            value={formData.completed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl placeholder-gray-400"
            required
          >
            <option value={false}>Not completed</option>
            <option value={true}>Completed</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block font-semibold text-center mb-1">
            Add Your Resource <span className="text-sm text-gray-500">(URL)</span>
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl placeholder-gray-400"
            placeholder="Enter the resource URL"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mx-auto"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
