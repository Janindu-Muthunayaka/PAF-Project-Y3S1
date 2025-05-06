import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { userService } from '../../services/ish/api';

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [creators, setCreators] = useState({});

  // Fetch plans from the backend
  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/plans');
      setPlans(response.data);
      
      // Fetch creator information for each plan
      const creatorPromises = response.data.map(plan => 
        userService.getUserById(plan.userId)
          .then(res => ({ id: plan.userId, data: res.data }))
          .catch(err => {
            console.error(`Failed to fetch creator for plan ${plan.id}:`, err);
            return { id: plan.userId, data: null };
          })
      );
      
      const creatorResults = await Promise.all(creatorPromises);
      const creatorMap = creatorResults.reduce((acc, { id, data }) => {
        if (data) {
          acc[id] = data;
        }
        return acc;
      }, {});
      
      setCreators(creatorMap);
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
        <h2 className="text-2xl font-bold mb-6">All Learning Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-blue-700 border-b pb-2">{plan.name}</h3>
                
                <div className="mb-3">
                  <p className="text-white font-medium mb-2">Description:</p>
                  <p className="text-white bg-slate-800 p-3 rounded-md border border-blue-900">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 text-sm">
                    <strong>Created by:</strong> {creators[plan.userId]?.firstName || 'Unknown User'}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Due Date:</strong> {new Date(plan.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Status:</strong> {plan.completed ? 'Completed' : 'Not Completed'}
                  </p>
                </div>

                {plan.url && (
                  <div className="mt-4">
                    <a
                      href={plan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Visit Resource
                    </a>
                  </div>
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