import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const LearningPlans = () => {
  // This is a placeholder page since learning plans aren't part of this phase
  const popularPlans = [
    {
      id: '1',
      title: 'Machine Learning Fundamentals',
      author: 'Emma Thompson',
      enrolled: '1.2k',
      description: 'Learn the basics of machine learning algorithms and applications.',
      rating: 5,
      reviews: 128
    },
    {
      id: '2',
      title: 'Web Accessibility Masterclass',
      author: 'Carlos Rodriguez',
      enrolled: '842',
      description: 'Comprehensive guide to making websites accessible to all users.',
      rating: 4,
      reviews: 95
    },
    {
      id: '3',
      title: 'Full Stack JavaScript Development',
      author: 'Sarah Johnson',
      enrolled: '2.3k',
      description: 'From frontend to backend - complete JavaScript development course.',
      rating: 4.5,
      reviews: 215
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Learning Plans</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FiPlus className="mr-2" />
          Create Plan
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Learning Plans</h2>
        <div className="py-8 text-center text-gray-500">
          <p>You haven't created any learning plans yet.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create Your First Learning Plan
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Learning Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularPlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">
                  <Link to={`/learning-plans/${plan.id}`} className="text-blue-600 hover:underline">
                    {plan.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">by {plan.author}</p>
                <p className="text-gray-700 mb-3">{plan.description}</p>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(plan.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {plan.rating % 1 !== 0 && (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  <span className="text-gray-600 text-sm ml-2">({plan.reviews} reviews)</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.enrolled} enrolled</p>
              </div>
              <div className="bg-gray-50 p-3 border-t">
                <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPlans;