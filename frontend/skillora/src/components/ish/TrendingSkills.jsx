import { FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';

const TrendingSkills = () => {
  const trendingSkills = [
    { name: 'React Native', growth: '+15%', link: '/explore?skill=react-native' },
    { name: 'Data Visualization', growth: '+8%', link: '/explore?skill=data-visualization' },
    { name: 'AWS Lambda', growth: '+12%', link: '/explore?skill=aws-lambda' },
    { name: 'TypeScript', growth: '+10%', link: '/explore?skill=typescript' },
    { name: 'User Research', growth: '+7%', link: '/explore?skill=user-research' },
  ];

  return (
    <div className="bg-dark-surface rounded-xl border border-dark-border shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <h2 className="text-xl font-semibold text-white">
          <span className="text-gradient">Trending</span>
          <span className="ml-2">Skills</span>
        </h2>
        <button 
          className="p-2 rounded-full hover:bg-dark-surface-light transition-all duration-200"
          aria-label="Refresh trending skills"
        >
          <FiRefreshCw className="h-5 w-5 text-primary-light" />
        </button>
      </div>
      
      <div className="py-2">
        {trendingSkills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between px-5 py-3 hover:bg-dark-surface-light transition-colors duration-150">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="font-medium text-dark-text">{skill.name}</span>
              <span className="px-2 py-0.5 bg-success bg-opacity-20 text-success text-xs font-medium rounded-full">
                {skill.growth}
              </span>
            </div>
            <Link 
              to={skill.link} 
              className="px-4 py-1.5 text-primary-light hover:text-primary text-sm font-medium rounded-md hover:bg-primary hover:bg-opacity-10 transition-colors"
            >
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSkills;