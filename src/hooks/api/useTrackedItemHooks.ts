import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTrackedItems,
  fetchTrackedItemDetails,
  createTrackedItem,
  saveTrackedItemAttributes,
  updateTrackedItemStepProgress,
} from '../../services/api';
import { TrackedItem, TrackedItemAttribute, TrackedItemStepProgress } from '../../types/TrackedItem';
import { ProductionUnit } from '../../views/project-detail/BatchTrackingComponent';

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
  return useMutation<TrackedItem, Error, Omit<TrackedItem, 'item_id' | 'date_created' | 'is_shipped' | 'shipped_date' | 'date_fully_completed'>>({
    mutationFn: createTrackedItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trackedItems', data.project_id.toString()] });
    },
  });
};

export const useSaveTrackedItemAttributes = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: string; attributes: TrackedItemAttribute[] }>({
    mutationFn: ({ itemId, attributes }) => saveTrackedItemAttributes(itemId, attributes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trackedItemDetails', variables.itemId] });
      // Potentially invalidate trackedItems list if attributes affect list view
    },
  });
};

export const useUpdateTrackedItemStepProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: string; stepId: string; progress: TrackedItemStepProgress }>({
    mutationFn: ({ itemId, stepId, progress }) => updateTrackedItemStepProgress(itemId, stepId, progress),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trackedItemDetails', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['trackedItems'] }); // Invalidate all tracked items to reflect progress changes
    },
  });
};
