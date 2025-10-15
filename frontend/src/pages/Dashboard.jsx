import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { projectAPI, bidAPI, contractAPI } from '../utils/api';
import { Briefcase, DollarSign, Clock, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, isClient, isFreelancer } = useAuth();
  const { projects, fetchProjects } = useProject();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeContracts: 0,
    totalEarnings: 0,
    completedProjects: 0
  });
  const [recentBids, setRecentBids] = useState([]);
  const [recentContracts, setRecentContracts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (isClient) {
        const projectsData = await fetchProjects();
        setStats(prev => ({
          ...prev,
          totalProjects: projectsData.total
        }));
      }

      if (isFreelancer) {
        const bidsResponse = await bidAPI.getByFreelancer(user.id);
        setRecentBids(bidsResponse.data.slice(0, 5));
      }

      const contractsResponse = await contractAPI.getUserContracts(user.id);
      setRecentContracts(contractsResponse.data.slice(0, 5));
      
      setStats(prev => ({
        ...prev,
        activeContracts: contractsResponse.data.filter(c => c.status === 'active').length,
        completedProjects: contractsResponse.data.filter(c => c.status === 'completed').length
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your {isClient ? 'projects' : 'freelance work'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {isClient ? 'Total Projects' : 'Total Bids'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isClient ? stats.totalProjects : recentBids.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeContracts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isFreelancer && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
            {recentBids.length > 0 ? (
              <div className="space-y-4">
                {recentBids.map((bid) => (
                  <div key={bid._id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{bid.project?.title}</p>
                        <p className="text-sm text-gray-600">${bid.amount}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent bids</p>
            )}
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Contracts</h3>
          {recentContracts.length > 0 ? (
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div key={contract._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{contract.project?.title}</p>
                      <p className="text-sm text-gray-600">${contract.amount}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent contracts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



