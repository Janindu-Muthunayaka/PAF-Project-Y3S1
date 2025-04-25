import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewPlans = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // Fetch all plans from the backend
  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/plans');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans', err);
    }
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Remove the deleted plan from the UI
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
        alert('Plan deleted successfully!');
      } else {
        alert('Failed to delete plan.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the plan.');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">All Plans</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Due Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id || plan._id} className="hover:bg-gray-50">
                <td className="p-3 border">{plan.name}</td>
                <td className="p-3 border">{plan.description}</td>
                <td className="p-3 border">{new Date(plan.dueDate).toLocaleDateString()}</td>
                <td className="p-3 border">{plan.completed ? 'Completed' : 'Not completed'}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => navigate(`/update-plan/${plan.id || plan._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id || plan._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPlans;
