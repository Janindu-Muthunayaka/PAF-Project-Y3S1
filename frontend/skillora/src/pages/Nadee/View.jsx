import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/ish/UserContext';

const ViewPlans = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/plans/user', {
          headers: {
            'user-id': user.id,
          },
        });
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Status Line</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{plan.name}</h2>

              <p className="text-gray-700 mb-4">{plan.description}</p>

              <div className="text-sm mb-2">
                <strong>Due Date:</strong> {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : 'N/A'}
              </div>

              <div className="text-sm mb-2">
                <strong>Status:</strong> {plan.completed ? 'Completed ✅' : 'Not Completed ❌'}
              </div>

              <div className="text-sm mb-2">
                <strong>Created At:</strong> {plan.createdAt ? new Date(plan.createdAt).toLocaleString() : 'N/A'}
              </div>

              <div className="text-sm mb-2">
                <strong>Updated At:</strong> {plan.updatedAt ? new Date(plan.updatedAt).toLocaleString() : 'N/A'}
              </div>

              <div className="text-sm">
                <strong>URL:</strong>{' '}
                {plan.url ? (
                  <a href={plan.url} className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPlans;
