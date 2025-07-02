import { useQuery } from 'react-query';
import { fetchProjects, fetchProjectById, fetchProjectSteps, fetchTrackedItems } from 'src/services/api';
import { Project } from 'src/types/Project';
import { ProductionStep, ProductionUnit } from 'src/views/project-detail/BatchTrackingComponent';

// Hook to get all projects (for the dashboard)
export const useGetProjects = () => {
  return useQuery<Project[], Error>('projects', fetchProjects);
};

// Hook to get a single project by its ID (for the detail page)
export const useGetProjectById = (projectId: string | undefined) => {
  return useQuery<Project | null, Error>(
    ['project', projectId], // Unique query key
    () => fetchProjectById(projectId),
    {
      enabled: !!projectId, // Only run the query if projectId is not null/undefined
    }
  );
};

// Hook to get project steps by project ID
export const useGetProjectSteps = (projectId: string | undefined) => {
  return useQuery<ProductionStep[], Error>(
    ['projectSteps', projectId],
    () => fetchProjectSteps(projectId),
    {
      enabled: !!projectId,
    }
  );
};

// Hook to get tracked items by project ID
export const useGetTrackedItems = (projectId: string | undefined) => {
  return useQuery<ProductionUnit[], Error>(
    ['trackedItems', projectId],
    () => fetchTrackedItems(projectId),
    {
      enabled: !!projectId,
    }
  );
};