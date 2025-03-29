import { useState } from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';

const Network = () => {
  // This is a placeholder page since networking isn't part of this phase
  const [searchTerm, setSearchTerm] = useState('');
  
  const suggestedConnections = [
    { 
      id: '1', 
      name: 'Jessica Wang', 
      role: 'DevOps Engineer',
      company: 'TechCorp',
      mutualConnections: 5,
      avatar: null 
    },
    { 
      id: '2', 
      name: 'David Patel', 
      role: 'Data Scientist',
      company: 'DataX Analytics',
      mutualConnections: 3,
      avatar: null 
    },
    { 
      id: '3', 
      name: 'Sarah Johnson', 
      role: 'Frontend Developer',
      company: 'WebFusion',
      mutualConnections: 2,
      avatar: null 
    },
    { 
      id: '4', 
      name: 'Michael Chen', 
      role: 'UX Designer',
      company: 'DesignHub',
      mutualConnections: 7,
      avatar: null 
    }
  ];

  const filteredConnections = searchTerm
    ? suggestedConnections.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suggestedConnections;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Network</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for people by name, role, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">My Network</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Connections</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">0</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Followers</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">0</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Following</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">0</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="w-2/3">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">People You May Know</h2>
            
            {filteredConnections.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No matches found for "{searchTerm}"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConnections.map((person) => (
                  <div key={person.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="h-12 w-12 rounded-full mr-4"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{person.name}</h3>
                        <p className="text-gray-600 text-sm">{person.role} at {person.company}</p>
                        <p className="text-gray-500 text-sm">{person.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <button className="flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50">
                      <FiUserPlus className="mr-1" />
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;