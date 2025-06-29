import { useQuery } from 'react-query';
import { fetchInventoryItems } from 'src/services/api';
import { InventoryItem } from 'src/types/Inventory';

export const useGetInventoryItems = () => {
    return useQuery<InventoryItem[], Error>('inventoryItems', fetchInventoryItems);
};