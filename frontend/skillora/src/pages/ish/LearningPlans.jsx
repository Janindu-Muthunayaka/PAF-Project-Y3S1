import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);

  // Fetch plans from the backend
  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/plans');
      setPlans(response.data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-end items-center mb-6 space-x-4">
        {/* My Learning Plans Button */}
        <Link
          to="/learning-plans/view"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          My Learning Plans
        </Link>

        {/* Create Plan Button */}
        <Link
          to="/learning-plans/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Plan
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Learning Plans</h2>
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