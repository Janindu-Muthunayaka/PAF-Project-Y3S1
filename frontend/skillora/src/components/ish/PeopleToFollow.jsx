import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from './ui/Card';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const PeopleToFollow = () => {
  const people = [
    { 
      id: '1', 
      name: 'Jessica Wang', 
      role: 'DevOps Engineer', 
      avatar: null 
    },
    { 
      id: '2', 
      name: 'David Patel', 
      role: 'Data Scientist', 
      avatar: null 
    }
  ];

  const handleFollow = (person) => {
    toast.success(`You are now following ${person.name}`);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">People to Follow</h2>
        <Link to="/network" className="text-sm text-primary-600 dark:text-primary-500 hover:underline">
          See All
        </Link>
      </div>
      <ul className="space-y-4">
        {people.map((person) => (
          <li key={person.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar
                src={person.avatar}
                name={person.name}
                size="md"
                className="mr-3"
              />
              <div>
                <Link to={`/profile/${person.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500">
                  {person.name}
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{person.role}</p>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleFollow(person)}
            >
              Follow
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PeopleToFollow;