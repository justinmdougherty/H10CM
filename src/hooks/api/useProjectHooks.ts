import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  fetchProjectSteps,
  fetchTrackedItems,
} from '../../services/api';
import { Project } from '../../types/Project';
import { ProjectStep } from '../../types/ProjectSteps';
import { ProductionUnit } from '../../types/Production';

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
  });
};

export const useGetProjects = useProjects;

export const useGetProjectById = (projectId: string | undefined) => {
  return useQuery<Project | null, Error>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId, // Only run the query if projectId is available
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, Omit<Project, 'project_id' | 'date_created'>>({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch to ensure the UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, Project>({
    mutationFn: updateProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id.toString()] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      // Both invalidate and refetch to ensure the UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
    },
  });
};

export const useGetProjectSteps = (projectId: string | undefined) => {
  return useQuery<ProjectStep[], Error>({
    queryKey: ['projectSteps', projectId],
    queryFn: () => fetchProjectSteps(projectId),
    enabled: !!projectId,
  });
};

export const useGetTrackedItems = (projectId: string | undefined) => {
  console.log('🔍 useGetTrackedItems: Hook called with projectId:', projectId);
  
  return useQuery<ProductionUnit[], Error>({
    queryKey: ['trackedItems', projectId],
    queryFn: () => {
      console.log('🔍 useGetTrackedItems: Executing query function for projectId:', projectId);
      return fetchTrackedItems(projectId);
    },
    enabled: !!projectId,
  });
};
