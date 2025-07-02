import axios from 'axios';
import { Project } from 'src/types/Project';
import { InventoryItem } from 'src/types/Inventory';
import { ProductionStep, ProductionUnit } from 'src/views/project-detail/BatchTrackingComponent';

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
    return data[0];
  }
  return data;
};

export const fetchProjectSteps = async (projectId: string | undefined): Promise<ProductionStep[]> => {
  if (!projectId) return [];
  const { data } = await apiClient.get(`/projects/${projectId}/steps`);
  return data;
};

export const fetchTrackedItems = async (projectId: string | undefined): Promise<ProductionUnit[]> => {
  if (!projectId) return [];
  const { data } = await apiClient.get(`/projects/${projectId}/tracked-items`);
  return data;
};

// --- Inventory API Functions (Example) ---
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/inventory-items');
    return data;
};