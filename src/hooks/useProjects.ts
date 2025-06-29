import { useQuery } from 'react-query';
import axios from 'axios';
import { Project } from 'src/types/Project';

// FIX: API_URL is now a relative path to work with the Vite proxy
const API_URL = '/api';

// --- Fetcher for ALL projects ---
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${API_URL}/projects`);
  if (Array.isArray(data)) {
      data.sort((a, b) => a.project_name.localeCompare(b.project_name));
  }
  return data;
};

// --- Fetcher for a SINGLE project by ID ---
const fetchProjectById = async (projectId: string | undefined): Promise<Project> => {
    if (!projectId) {
        throw new Error("Project ID is required.");
    }
    const { data } = await axios.get(`${API_URL}/projects/${projectId}`);
    if (Array.isArray(data) && data.length > 0) {
        return data[0];
    }
    return data;
};

// --- Custom hook for the Dashboard Page ---
export const useGetProjects = () => {
  return useQuery<Project[], Error>('projects', fetchProjects);
};

// --- Custom hook for the Detail Page ---
export const useGetProjectById = (projectId: string | undefined) => {
  return useQuery<Project, Error>(
    ['project', projectId], 
    () => fetchProjectById(projectId),
    {
        enabled: !!projectId, 
    }
  );
};