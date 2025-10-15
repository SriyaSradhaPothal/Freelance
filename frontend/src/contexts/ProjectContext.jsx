import { createContext, useContext, useState } from 'react';
import { projectAPI } from '../utils/api';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await projectAPI.getAll(filters);
      setProjects(response.data.projects);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await projectAPI.create(projectData);
      setProjects(prev => [response.data.project, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await projectAPI.update(id, projectData);
      setProjects(prev => 
        prev.map(project => 
          project._id === id ? response.data.project : project
        )
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectAPI.delete(id);
      setProjects(prev => prev.filter(project => project._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const value = {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};



