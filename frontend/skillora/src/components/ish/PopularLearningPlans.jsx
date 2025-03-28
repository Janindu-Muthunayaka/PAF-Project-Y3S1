import { Link } from 'react-router-dom';
import Card from './ui/Card';

const PopularLearningPlans = () => {
  const learningPlans = [
    {
      id: '1',
      title: 'Machine Learning Fundamentals',
      author: 'Emma Thompson',
      enrolled: '1.2k',
      rating: 5,
      reviews: 128
    },
    {
      id: '2',
      title: 'Web Accessibility Masterclass',
      author: 'Carlos Rodriguez',
      enrolled: '842',
      rating: 4,
      reviews: 95
    }
  ];

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Learning Plans</h2>
        <Link to="/learning-plans" className="text-sm text-primary-600 dark:text-primary-500 hover:underline">
          Browse All
        </Link>
      </div>
      <ul className="space-y-4">
        {learningPlans.map((plan) => (
          <li key={plan.id} className="border-b border-gray-200 dark:border-dark-700 pb-4 last:border-0 last:pb-0">
            <Link to={`/learning-plans/${plan.id}`} className="block">
              <h3 className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500">{plan.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">by {plan.author}</p>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-4 h-4 ${i < plan.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">({plan.reviews} reviews)</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-auto">{plan.enrolled} enrolled</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PopularLearningPlans;