import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTrackedItems,
  fetchTrackedItemDetails,
  createTrackedItem,
  saveTrackedItemAttributes,
  updateTrackedItemStepProgress,
} from '../../services/api';
import { TrackedItem, TrackedItemAttribute, TrackedItemStepProgress } from '../../types/TrackedItem';
import { ProductionUnit } from '../../types/Production';

export const useTrackedItems = (projectId: string | undefined) => {
  return useQuery<ProductionUnit[], Error>({
    queryKey: ['trackedItems', projectId],
    queryFn: () => fetchTrackedItems(projectId),
    enabled: !!projectId,
  });
};

export const useTrackedItemDetails = (itemId: string | undefined) => {
  return useQuery<TrackedItem, Error>({
    queryKey: ['trackedItemDetails', itemId],
    queryFn: () => fetchTrackedItemDetails(itemId as string),
    enabled: !!itemId,
  });
};

export const useCreateTrackedItem = () => {
  const queryClient = useQueryClient();
  return useMutation<TrackedItem, Error, Omit<TrackedItem, 'item_id' | 'date_created'>>({
    mutationFn: createTrackedItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trackedItems', data.project_id.toString()] });
    },
  });
};

export const useSaveTrackedItemAttributes = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { itemId: string; attributes: TrackedItemAttribute[]; projectId: string }
  >({
    mutationFn: ({ itemId, attributes }) => saveTrackedItemAttributes(itemId, attributes),
    onSuccess: (_data, variables) => {
      // Invalidate both the main list and the specific item details
      queryClient.invalidateQueries({ queryKey: ['trackedItems', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['trackedItemDetails', variables.itemId] });
    },
  });
};

export const useUpdateTrackedItemStepProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { itemId: string; stepId: string; progress: TrackedItemStepProgress; projectId: string }
  >({
    mutationFn: (variables) => {
      const progressWithStepId = {
        ...variables.progress,
        stepId: variables.stepId, // Ensure stepId is part of the object being passed
      };
      return updateTrackedItemStepProgress(
        variables.itemId,
        variables.stepId,
        progressWithStepId as any, // Using `as any` to bypass strict type checking here, assuming the backend handles the structure
      );
    },
    onSuccess: (_data, variables) => {
      // Invalidate the main list of items for the project
      queryClient.invalidateQueries({ queryKey: ['trackedItems', variables.projectId] });
      // Also invalidate the details for the specific item, in case the details view is open
      queryClient.invalidateQueries({ queryKey: ['trackedItemDetails', variables.itemId] });
    },
  });
};
