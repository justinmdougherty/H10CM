export type StepStatusType = 'Not Started' | 'In Progress' | 'Complete' | 'N/A';

export interface ProjectStep {
  step_id: string;
  project_id: string;
  step_name: string;
  step_order: number;
}

export interface UnitStepStatus {
  stepId: string;
  status: StepStatusType;
  completedDate?: string;
  completedBy?: string;
}

export interface ProductionUnit {
  item_id: string;
  unit_serial_number: string;
  pcb_serial_number?: string;
  step_statuses?: UnitStepStatus[];
  is_shipped?: boolean;
  shipped_date?: string;
  date_fully_completed?: string;
  [key: string]: any; // For dynamic attributes
}

export interface TableColumnConfig {
  id: string;
  label: string;
  width?: string;
  minWidth?: number;
  tabs: string[];
  render?: (unit: ProductionUnit, value: any) => React.ReactNode;
}
