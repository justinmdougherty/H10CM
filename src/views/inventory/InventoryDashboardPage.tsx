import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import {
  useGetAllInventory,
  useGetInventoryByProject,
  useDeleteInventoryItem,
} from '../../hooks/api/useInventoryHooks';
import { useProjects } from '../../hooks/api/useProjectHooks'; // Assuming this hook exists to fetch projects
import { InventoryItem } from '../../types/Inventory';
import AddInventoryItemModal from './modals/AddInventoryItemModal';
import EditInventoryItemModal from './modals/EditInventoryItemModal';

const InventoryDashboardPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const { data: projects = [] } = useProjects();
  const { data: allInventory = [], isLoading: isLoadingAll } = useGetAllInventory();
  const { data: projectInventory = [], isLoading: isLoadingProject } = useGetInventoryByProject(
    selectedProjectId as number,
  );
  const deleteInventoryItemMutation = useDeleteInventoryItem();

  const inventoryData = selectedProjectId ? projectInventory : allInventory;
  const isLoading = selectedProjectId ? isLoadingProject : isLoadingAll;

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedProjectId(value === '' ? '' : Number(value));
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItemMutation.mutate(id);
    }
  };

  return (
    <PageContainer title="Inventory Dashboard" description="This is the inventory dashboard">
      <Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5">Inventory Dashboard</Typography>

          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="project-filter-label">Filter by Project</InputLabel>
            <Select
              labelId="project-filter-label"
              value={String(selectedProjectId)}
              label="Filter by Project"
              onChange={handleProjectChange}
            >
              <MenuItem value="">
                <em>All Projects</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.project_id} value={project.project_id}>
                  {project.project_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddModal}>
            Add Inventory Item
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Part Number</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Reorder Point</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  inventoryData.map((item: InventoryItem) => (
                    <TableRow key={item.inventory_item_id}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell>{item.part_number}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.current_stock_level}</TableCell>
                      <TableCell>{item.unit_of_measure}</TableCell>
                      <TableCell>{item.reorder_point}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleOpenEditModal(item)}>Edit</Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteItem(item.inventory_item_id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <AddInventoryItemModal open={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditInventoryItemModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        item={selectedItem}
      />
    </PageContainer>
  );
};

export default InventoryDashboardPage;
