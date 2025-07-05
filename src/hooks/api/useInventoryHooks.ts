import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllInventory,
  getInventoryByProject,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../../services/api';
import { InventoryItem } from '../../types/Inventory';

export const useGetInventoryByProject = (projectId: number, options?: { enabled?: boolean }) => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ['inventory', projectId],
    queryFn: () => getInventoryByProject(projectId),
    enabled: options?.enabled,
  });
};

export const useGetAllInventory = () => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ['inventory'],
    queryFn: getAllInventory,
  });
};

export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, Omit<InventoryItem, 'inventory_item_id'>>({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, InventoryItem>({
    mutationFn: updateInventoryItem,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      if (variables.project_id) {
        queryClient.invalidateQueries({ queryKey: ['inventory', variables.project_id] });
      }
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
