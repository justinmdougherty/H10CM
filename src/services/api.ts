import axios from 'axios';
import { Project } from 'src/types/Project';
import { InventoryItem, InventoryAdjustment, InventoryTransaction } from 'src/types/Inventory';
import { ProductionUnit } from 'src/types/Production';
import { ProjectStep } from 'src/types/ProjectSteps';
import { AttributeDefinition } from 'src/types/AttributeDefinition'; // Assuming this type exists
import { StepInventoryRequirement } from 'src/types/StepInventoryRequirement'; // Assuming this type exists
import { TrackedItem, TrackedItemAttribute, TrackedItemStepProgress } from 'src/types/TrackedItem';

// The base URL will be handled by the Vite proxy you have set up
const apiClient = axios.create({
  baseURL: '/api',
});

// --- Project API Functions ---
export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get('/projects');
  // The sorting is now handled in the API, but as a fallback, we can sort here.
  if (Array.isArray(data)) {
    data.sort((a, b) => a.project_name.localeCompare(b.project_name));
  }
  return data;
};

export const fetchProjectById = async (projectId: string | undefined): Promise<Project | null> => {
  if (!projectId) return null;
  const { data } = await apiClient.get(`/projects/${projectId}`);
  // APIs for a single item might return an array with one item
  if (Array.isArray(data) && data.length > 0) {
    const projectData = data[0];
    // Derive project_type based on project_name
    let derivedProjectType = 'OTHER';
    if (projectData.project_name === 'PR') {
      derivedProjectType = 'PR';
    } else if (projectData.project_name === 'Assembly Line A') {
      derivedProjectType = 'ASSEMBLY';
    }
    return { ...projectData, project_type: derivedProjectType };
  }
  return data;
};

export const createProject = async (project: Omit<Project, 'project_id' | 'date_created'>): Promise<Project> => {
  const { data } = await apiClient.post('/projects', project);
  return data;
};

export const updateProject = async (project: Project): Promise<Project> => {
  const { data } = await apiClient.put(`/projects/${project.project_id}`, project);
  return data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}`);
};

export const fetchProjectSteps = async (projectId: string | undefined): Promise<ProjectStep[]> => {
  if (!projectId) return [];
  const response = await apiClient.get(`/projects/${projectId}/steps`);
  const apiData = response.data;
  // Now, access the nested 'data' property which contains the array of steps
  return Array.isArray(apiData.data) ? apiData.data : [];
};

export const createProjectStep = async (step: Omit<ProjectStep, 'step_id'>): Promise<ProjectStep> => {
  const { data } = await apiClient.post('/steps', step);
  return data;
};

export const updateProjectStep = async (step: ProjectStep): Promise<ProjectStep> => {
  const { data } = await apiClient.put(`/steps/${step.step_id}`, step);
  return data;
};

export const deleteProjectStep = async (stepId: string): Promise<void> => {
  await apiClient.delete(`/steps/${stepId}`);
};

export const fetchTrackedItems = async (projectId: string | undefined): Promise<ProductionUnit[]> => {
  if (!projectId) return [];
  console.log('Fetching tracked items for project:', projectId);
  const response = await apiClient.get(`/projects/${projectId}/tracked-items`);
  console.log('API response:', response.data);
  const data = response.data.data;
  console.log('Extracted data:', data);
  // Ensure data is an array, otherwise return an empty array
  return Array.isArray(data) ? data : [];
};

export const fetchTrackedItemDetails = async (itemId: string): Promise<TrackedItem> => {
  const { data } = await apiClient.get(`/tracked-items/${itemId}`);
  return data;
};

export const createTrackedItem = async (item: Omit<TrackedItem, 'item_id' | 'date_created'>): Promise<TrackedItem> => {
  const { data } = await apiClient.post('/tracked-items', item);
  return data;
};

export const saveTrackedItemAttributes = async (itemId: string, attributes: TrackedItemAttribute[]): Promise<void> => {
  await apiClient.post(`/tracked-items/${itemId}/attributes`, attributes);
};

export const updateTrackedItemStepProgress = async (itemId: string, stepId: string, progress: TrackedItemStepProgress): Promise<void> => {
  await apiClient.put(`/tracked-items/${itemId}/steps/${stepId}`, { 
    status: progress.status, 
    completed_by_user_name: progress.completed_by_user_name
  });
};

// --- Inventory API Functions ---
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/inventory-items');
    return data;
};

export const fetchInventoryItemById = async (inventoryItemId: string): Promise<InventoryItem> => {
  const { data } = await apiClient.get(`/inventory-items/${inventoryItemId}`);
  return data;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'inventory_item_id'>): Promise<InventoryItem> => {
  const { data } = await apiClient.post('/inventory-items', item);
  return data;
};

export const updateInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  const { data } = await apiClient.put(`/inventory-items/${item.inventory_item_id}`, item);
  return data;
};

export const adjustInventoryStock = async (adjustment: InventoryAdjustment): Promise<void> => {
  await apiClient.post('/inventory-items/adjust', adjustment);
};

export const fetchInventoryTransactions = async (inventoryItemId: string): Promise<InventoryTransaction[]> => {
  const { data } = await apiClient.get(`/inventory-items/${inventoryItemId}/transactions`);
  return data;
};

export const getInventoryByProject = async (projectId: number): Promise<InventoryItem[]> => {
  const { data } = await apiClient.get(`/inventory/project/${projectId}`);
  return data;
};

export const getAllInventory = async (): Promise<InventoryItem[]> => {
  const response = await apiClient.get('/inventory-items');
  return response.data.data; // Extract data from the nested data property
};

export const addInventoryItem = async (newItem: Omit<InventoryItem, 'inventory_item_id'>): Promise<InventoryItem> => {
  const { data } = await apiClient.post('/inventory-items', newItem);
  return data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
  await apiClient.delete(`/inventory-items/${id}`);
};

// --- Attribute Definition API Functions ---
export const fetchProjectAttributes = async (projectId: string): Promise<AttributeDefinition[]> => {
  const { data } = await apiClient.get(`/projects/${projectId}/attributes`);
  // Handle both direct array and { data: array } response formats
  return Array.isArray(data) ? data : (data.data || []);
};

export const createAttributeDefinition = async (attribute: Omit<AttributeDefinition, 'attribute_definition_id'>): Promise<AttributeDefinition> => {
  const { data } = await apiClient.post('/attributes', attribute);
  return data;
};

export const updateAttributeDefinition = async (attribute: AttributeDefinition): Promise<AttributeDefinition> => {
  const { data } = await apiClient.put(`/attributes/${attribute.attribute_definition_id}`, attribute);
  return data;
};

export const deleteAttributeDefinition = async (attributeId: string): Promise<void> => {
  await apiClient.delete(`/attributes/${attributeId}`);
};

// --- Step Inventory Requirements API Functions ---
export const fetchStepInventoryRequirements = async (stepId: string): Promise<StepInventoryRequirement[]> => {
  const { data } = await apiClient.get(`/steps/${stepId}/inventory-requirements`);
  return data;
};

export const createStepInventoryRequirement = async (requirement: Omit<StepInventoryRequirement, 'requirement_id'>): Promise<StepInventoryRequirement> => {
  const { data } = await apiClient.post('/inventory-requirements', requirement);
  return data;
};

export const updateStepInventoryRequirement = async (requirement: StepInventoryRequirement): Promise<StepInventoryRequirement> => {
  const { data } = await apiClient.put(`/inventory-requirements/${requirement.requirement_id}`, requirement);
  return data;
};

export const deleteStepInventoryRequirement = async (requirementId: string): Promise<void> => {
  await apiClient.delete(`/inventory-requirements/${requirementId}`);
};

// --- View Endpoints API Functions ---
export const fetchInventoryStockStatusView = async (): Promise<any[]> => {
  const { data } = await apiClient.get('/views/inventory-stock-status');
  return data;
};

export const fetchTrackedItemsOverviewView = async (): Promise<any[]> => {
  const { data } = await apiClient.get('/views/tracked-items-overview');
  return data;
};

export const fetchStepProgressStatusView = async (): Promise<any[]> => {
  const { data } = await apiClient.get('/views/step-progress-status');
  return data;
};
