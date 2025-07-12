import axios from 'axios';
import { Project } from 'src/types/Project';
import { InventoryItem, InventoryAdjustment, InventoryTransaction } from 'src/types/Inventory';
import { BulkSubmissionResult } from 'src/types/Cart';
import { ProductionUnit } from 'src/types/Production';
import { ProjectStep } from 'src/types/ProjectSteps';
import { AttributeDefinition } from 'src/types/AttributeDefinition'; // Assuming this type exists
import { StepInventoryRequirement } from 'src/types/StepInventoryRequirement'; // Assuming this type exists
import { TrackedItem, TrackedItemAttribute, TrackedItemStepProgress } from 'src/types/TrackedItem';
import { PendingOrderItem, PendingOrderSummary, ReceiveItemsRequest, PendingOrderStatus } from '../types/PendingOrders';
import smartNotifications from './smartNotificationService';

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

export const batchUpdateTrackedItemStepProgress = async (
  itemIds: string[], 
  stepId: string, 
  progress: Omit<TrackedItemStepProgress, 'item_id' | 'step_id'>
): Promise<void> => {
  await apiClient.post('/tracked-items/batch-step-progress', {
    itemIds,
    stepId,
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

// Bulk operations
export const bulkAdjustInventoryStock = async (adjustments: InventoryAdjustment[]): Promise<BulkSubmissionResult> => {
  const { data } = await apiClient.post('/inventory-items/bulk-adjust', { adjustments });
  return data;
};

export const bulkAddInventoryItems = async (items: Omit<InventoryItem, 'inventory_item_id' | 'current_stock_level'>[]): Promise<BulkSubmissionResult> => {
  const { data } = await apiClient.post('/inventory-items/bulk-add', { items });
  return data;
};

export const fetchInventoryTransactions = async (inventoryItemId: string): Promise<InventoryTransaction[]> => {
  const { data } = await apiClient.get(`/inventory-items/${inventoryItemId}/transactions`);
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data;
  }
  
  // If the response has a data property with an array
  if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Default to empty array if format is unexpected
  console.warn('Unexpected transaction data format:', data);
  return [];
};

export const getInventoryByProject = async (projectId: number): Promise<InventoryItem[]> => {
  const { data } = await apiClient.get(`/inventory/project/${projectId}`);
  return data;
};

// The API returns { data: InventoryItem[] }
export const getAllInventory = async (): Promise<{ data: InventoryItem[] }> => {
  const response = await apiClient.get('/inventory-items');
  return response.data;
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

// Pending Orders API
export const fetchPendingOrders = async (): Promise<PendingOrderItem[]> => {
  // TODO: Replace with actual API call when backend is ready
  // For now, use localStorage as temporary storage
  try {
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    console.log('Fetched pending orders (localStorage):', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    return [];
  }
  
  // Original API call (commented out for now)
  // const { data } = await apiClient.get('/pending-orders');
  // return data;
};

export const createPendingOrders = async (items: Omit<PendingOrderItem, 'pending_order_id' | 'quantity_received' | 'date_requested' | 'status'>[]): Promise<BulkSubmissionResult> => {
  // TODO: Replace with actual API call when backend is ready
  // For now, use localStorage as temporary storage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    const updatedOrders = [...existingOrders];
    const newOrders: any[] = [];
    
    items.forEach(item => {
      // Look for existing pending order with same item details
      const existingIndex = updatedOrders.findIndex((order: PendingOrderItem) => 
        order.item_name === item.item_name &&
        order.part_number === item.part_number &&
        order.supplier === item.supplier &&
        order.status === 'requested' // Only combine with requested orders
      );
      
      if (existingIndex !== -1) {
        // Update existing order by adding quantities
        updatedOrders[existingIndex] = {
          ...updatedOrders[existingIndex],
          quantity_requested: updatedOrders[existingIndex].quantity_requested + item.quantity_requested,
          estimated_cost: (updatedOrders[existingIndex].estimated_cost || 0) + (item.estimated_cost || 0),
          notes: `${updatedOrders[existingIndex].notes || ''}\nAdded ${item.quantity_requested} ${item.unit_of_measure} from bulk submission`.trim(),
        };
        
        console.log(`Combined ${item.quantity_requested} ${item.unit_of_measure} of ${item.item_name} with existing order`);
      } else {
        // Create new order
        const newOrder = {
          ...item,
          pending_order_id: Date.now() + Math.random(), // Simple ID generation
          quantity_received: 0,
          date_requested: new Date(),
          status: 'requested' as PendingOrderStatus,
        };
        
        updatedOrders.push(newOrder);
        newOrders.push(newOrder);

        // Create notification for new order
        smartNotifications.createNotification({
          type: 'info',
          category: 'orders',
          title: 'New Order Requested',
          message: `Request for ${item.quantity_requested} ${item.unit_of_measure} of ${item.item_name}`,
          actionRequired: false,
          relatedEntityType: 'order',
          relatedEntityId: newOrder.pending_order_id,
          actionUrl: '/orders/pending',
          actionLabel: 'View Orders',
          metadata: { 
            itemName: item.item_name,
            quantity: item.quantity_requested,
            unitOfMeasure: item.unit_of_measure,
            supplier: item.supplier
          },
          icon: '📝',
        });
      }
    });
    
    localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
    
    console.log('Created/updated pending orders (localStorage):', { newOrders, totalOrders: updatedOrders.length });
    
    return {
      success: true,
      message: `Successfully processed ${items.length} pending orders (${newOrders.length} new, ${items.length - newOrders.length} combined with existing)`,
      successfulItems: newOrders.map(order => order.pending_order_id.toString()),
      failedItems: []
    };
  } catch (error) {
    console.error('Error creating pending orders:', error);
    throw new Error('Failed to create pending orders');
  }
  
  // Original API call (commented out for now)
  // const { data } = await apiClient.post('/pending-orders/bulk-create', { items });
  // return data;
};

export const updatePendingOrderStatus = async (
  pending_order_id: number, 
  status: PendingOrderStatus, 
  notes?: string
): Promise<PendingOrderItem> => {
  // TODO: Replace with actual API call when backend is ready
  // For now, use localStorage as temporary storage
  try {
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    const updatedOrders = orders.map((order: PendingOrderItem) => {
      if (order.pending_order_id === pending_order_id) {
        const oldStatus = order.status;
        const updatedOrder = {
          ...order,
          status,
          notes: notes || order.notes,
        };

        // Set appropriate date and user fields based on status
        if (status === 'ordered' && order.status === 'requested') {
          updatedOrder.date_ordered = new Date();
          updatedOrder.ordered_by = 'Current User'; // Will be updated with real user in component
        } else if (status === 'shipped' && (order.status === 'ordered' || order.status === 'requested')) {
          updatedOrder.date_shipped = new Date();
          updatedOrder.shipped_by = 'Current User'; // Will be updated with real user in component
        }

        // Create notification for status change
        smartNotifications.notifyOrderStatusChange(updatedOrder, oldStatus);

        return updatedOrder;
      }
      return order;
    });
    
    localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
    const updatedOrder = updatedOrders.find((order: PendingOrderItem) => order.pending_order_id === pending_order_id);
    console.log('Updated order status (localStorage):', updatedOrder);
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
  
  // Original API call (commented out for now)
  // const { data } = await apiClient.patch(`/pending-orders/${pending_order_id}/status`, { 
  //   status, 
  //   notes 
  // });
  // return data;
};

export const receiveOrderItems = async (request: ReceiveItemsRequest): Promise<BulkSubmissionResult> => {
  // TODO: Replace with actual API call when backend is ready
  // For now, use localStorage as temporary storage
  try {
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    const updatedOrders: PendingOrderItem[] = [];
    
    orders.forEach((order: PendingOrderItem) => {
      const receivedItem = request.items.find(item => item.pending_order_id === order.pending_order_id);
      
      if (receivedItem && receivedItem.quantity_received > 0) {
        const remainingQty = order.quantity_requested - order.quantity_received - receivedItem.quantity_received;
        
        if (remainingQty > 0) {
          // Create new order for remaining quantity
          const remainingOrder = {
            ...order,
            pending_order_id: Date.now() + Math.random(), // New ID for remaining order
            quantity_requested: remainingQty,
            quantity_received: 0,
            status: 'requested' as PendingOrderStatus,
            notes: `Split from partial receipt of order #${order.pending_order_id}. Original qty: ${order.quantity_requested}, previously received: ${order.quantity_received}, this receipt: ${receivedItem.quantity_received}, remaining: ${remainingQty}`,
            date_requested: new Date(), // Reset request date for new order
          };
          updatedOrders.push(remainingOrder);
        }
        
        // Mark original order as received with actual received quantity
        const completedOrder = {
          ...order,
          quantity_received: order.quantity_received + receivedItem.quantity_received,
          status: 'received' as PendingOrderStatus,
          date_received: new Date(),
          received_by: request.received_by || 'Unknown User',
          notes: receivedItem.notes ? `${order.notes || ''}\n${receivedItem.notes}`.trim() : order.notes,
        };
        updatedOrders.push(completedOrder);
        
        // Create notification for received order
        smartNotifications.createNotification({
          type: 'success',
          category: 'orders',
          title: remainingQty > 0 ? 'Partial Order Received' : 'Order Received',
          message: `Received ${receivedItem.quantity_received} ${order.unit_of_measure} of ${order.item_name}${remainingQty > 0 ? ` (${remainingQty} still pending)` : ''}`,
          actionRequired: false,
          relatedEntityType: 'order',
          relatedEntityId: order.pending_order_id,
          actionUrl: '/orders/pending',
          actionLabel: 'View Orders',
          metadata: { 
            itemName: order.item_name,
            quantityReceived: receivedItem.quantity_received,
            quantityRemaining: remainingQty,
            isPartial: remainingQty > 0
          },
          icon: remainingQty > 0 ? '📦' : '✅',
        });
        
        // TODO: Add the received quantity to actual inventory here
        console.log(`TODO: Add ${receivedItem.quantity_received} ${order.unit_of_measure} of ${order.item_name} to inventory`);
        
      } else {
        // Keep unchanged orders
        updatedOrders.push(order);
      }
    });
    
    localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
    console.log('Updated received items with split orders (localStorage):', updatedOrders);
    
    // Count successful items
    const processedItems = request.items.filter(item => item.quantity_received > 0);
    
    return {
      success: true,
      message: `Successfully received ${processedItems.length} items. Partial receipts created separate orders for remaining quantities.`,
      successfulItems: processedItems.map(item => item.pending_order_id.toString()),
      failedItems: []
    };
  } catch (error) {
    console.error('Error receiving items:', error);
    throw new Error('Failed to receive items');
  }
  
  // Original API call (commented out for now)
  // const { data } = await apiClient.post('/pending-orders/receive', request);
  // return data;
};

export const getPendingOrdersSummary = async (): Promise<PendingOrderSummary> => {
  const { data } = await apiClient.get('/pending-orders/summary');
  return data;
};

export const deletePendingOrder = async (pending_order_id: number): Promise<void> => {
  await apiClient.delete(`/pending-orders/${pending_order_id}`);
};
