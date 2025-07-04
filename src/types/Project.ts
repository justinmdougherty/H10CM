export interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_type: string; // Added project_type
  status: string;
  date_created: string;
  last_modified: string;
}
