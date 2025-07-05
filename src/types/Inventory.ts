export interface InventoryItem {
  inventory_item_id: number;
  item_name: string;
  part_number: string;
  description?: string;
  unit_of_measure: string;
  current_stock_level: number;
  reorder_point?: number;
  project_id?: number; // For client-side filtering, not always in API response
}

export interface InventoryAdjustment {
  inventory_item_id: string;
  adjustment_quantity: number;
  adjustment_type: 'add' | 'subtract';
  reason?: string;
  adjusted_by_user_name?: string;
}

export interface InventoryTransaction {
  transaction_id: string;
  inventory_item_id: string;
  transaction_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  transaction_date: string;
  related_entity_id?: string; // e.g., project_id, tracked_item_id
  notes?: string;
}
