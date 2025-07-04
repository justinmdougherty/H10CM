import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  fetchProjectSteps,
  fetchTrackedItems,
} from '../../services/api';
import { Project } from '../../types/Project';
import { ProjectStep } from '../../types/ProjectSteps';
import { TrackedItem } from '../../types/TrackedItem';

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
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
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Invalidate projects cache on success
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

export const useGetProjectSteps = (projectId: string | undefined) => {
  return useQuery<ProjectStep[], Error>({
    queryKey: ['projectSteps', projectId],
    queryFn: () => fetchProjectSteps(projectId),
    enabled: !!projectId,
  });
};

export const useGetTrackedItems = (projectId: string | undefined) => {
  return useQuery<TrackedItem[], Error>({
    queryKey: ['trackedItems', projectId],
    queryFn: () => fetchTrackedItems(projectId),
    enabled: !!projectId,
  });
};
