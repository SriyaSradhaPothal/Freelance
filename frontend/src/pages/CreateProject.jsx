import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../utils/api';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-development',
    budget: '',
    budgetType: 'fixed',
    duration: '1-to-4-weeks',
    skills: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectAPI.create(formData);
      toast.success('Project created successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'web-development',
        budget: '',
        budgetType: 'fixed',
        duration: '1-to-4-weeks',
        skills: []
      });
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="input w-full"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={6}
            className="textarea w-full"
            placeholder="Describe your project requirements..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              className="input w-full"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
              <option value="data-science">Data Science</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              name="duration"
              className="input w-full"
              value={formData.duration}
              onChange={handleChange}
            >
              <option value="less-than-1-week">Less than 1 week</option>
              <option value="1-to-4-weeks">1 to 4 weeks</option>
              <option value="1-to-3-months">1 to 3 months</option>
              <option value="3-to-6-months">3 to 6 months</option>
              <option value="more-than-6-months">More than 6 months</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget
            </label>
            <input
              type="number"
              name="budget"
              required
              className="input w-full"
              placeholder="Enter budget amount"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type
            </label>
            <select
              name="budgetType"
              className="input w-full"
              value={formData.budgetType}
              onChange={handleChange}
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-3"
        >
          {loading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;



