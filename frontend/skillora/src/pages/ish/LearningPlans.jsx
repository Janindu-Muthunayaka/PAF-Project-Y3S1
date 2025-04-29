import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash } from 'react-icons/fi';
import axios from 'axios';

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // Fetch plans from the backend
  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/plans');
      setPlans(response.data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  // Handle delete plan
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      alert('Plan deleted successfully!');
    } catch (err) {
      console.error('Failed to delete plan:', err);
      alert('Failed to delete plan.');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-end items-center mb-6">
        {/* Create Plan Button */}
        <Link
          to="/learning-plans/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Plan
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Learning Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 text-blue-600">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Due Date:</strong> {new Date(plan.dueDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Status:</strong> {plan.completed ? 'Completed' : 'Not Completed'}
                </p>
                {plan.url && (
                  <p className="text-blue-500 text-sm mb-2">
                    <a href={plan.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Visit Resource
                    </a>
                  </p>
                )}
                <div className="flex justify-between mt-4">
                  {/* Update Icon */}
                  <button
                    onClick={() => navigate(`/update-plan/${plan.id}`)}
                    className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    <FiEdit className="mr-2" />
                    Update
                  </button>
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <FiTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No plans found. Create your first learning plan!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlans;