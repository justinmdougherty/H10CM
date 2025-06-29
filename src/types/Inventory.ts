export interface InventoryItem {
    inventory_item_id: number;
    item_name: string;
    part_number: string | null; // Assuming part_number can be optional
    description: string | null;   // Assuming description can be optional
    unit_of_measure: string;
    current_stock_level: number;
    reorder_point: number | null; // Assuming reorder_point can be optional
    supplier_info: string | null; // Assuming supplier_info can be optional
    cost_per_unit: number | null;   // Assuming cost_per_unit can be optional
  }