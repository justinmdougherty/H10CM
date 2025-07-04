import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchInventoryItems,
  fetchInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  adjustInventoryStock,
  fetchInventoryTransactions,
} from '../../services/api';
import { InventoryItem, InventoryAdjustment, InventoryTransaction } from '../../types/Inventory';

export const useInventoryItems = () => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
  });
};

export const useInventoryItemDetails = (inventoryItemId: string | undefined) => {
  return useQuery<InventoryItem, Error>({
    queryKey: ['inventoryItem', inventoryItemId],
    queryFn: () => fetchInventoryItemById(inventoryItemId as string),
    enabled: !!inventoryItemId,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, Omit<InventoryItem, 'inventory_item_id'>>({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, InventoryItem>({
    mutationFn: updateInventoryItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryItem', data.inventory_item_id] });
    },
  });
};

export const useAdjustInventoryStock = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, InventoryAdjustment>({
    mutationFn: adjustInventoryStock,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryItem', variables.inventory_item_id] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions', variables.inventory_item_id] });
    },
  });
};

export const useInventoryTransactions = (inventoryItemId: string | undefined) => {
  return useQuery<InventoryTransaction[], Error>({
    queryKey: ['inventoryTransactions', inventoryItemId],
    queryFn: () => fetchInventoryTransactions(inventoryItemId as string),
    enabled: !!inventoryItemId,
  });
};
