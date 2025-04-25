import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePlan = () => {
  const { planId } = useParams(); // Get the planId from the URL
  const navigate = useNavigate(); // For navigation after update
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    completed: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the existing plan data when the component mounts
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/plans/${planId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name,
            description: data.description,
            dueDate: data.dueDate.split('T')[0], // Format date for input
            completed: data.completed,
          });
          setLoading(false);
        } else {
          setError('Failed to fetch plan data');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching plan data');
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Plan updated successfully!');
        navigate('/learning-plans/view'); // Redirect to ViewPlans after update
      } else {
        alert('Failed to update plan');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-red-100 p-4 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Plan</h2>
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                completed: e.target.value === 'true',
              }))
            }
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value={false}>Not completed</option>
            <option value={true}>Completed</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Update Plan
        </button>
      </form>
    </div>
  );
};

export default UpdatePlan;
