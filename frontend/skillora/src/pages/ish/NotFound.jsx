import { Link } from 'react-router-dom';
import Button from '../../components/ish/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Page not found</h2>
        <p className="mt-6 text-lg leading-7 text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button 
            to="/" 
            variant="primary"
            size="lg"
          >
            Go back home
          </Button>
          <Button 
            to="/explore" 
            variant="outline"
            size="lg"
          >
            Explore content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;