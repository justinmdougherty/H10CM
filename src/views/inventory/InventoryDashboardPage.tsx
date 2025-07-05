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
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import { useGetAllInventory, useGetInventoryByProject } from '../../hooks/api/useInventoryHooks';
import { useProjects } from '../../hooks/api/useProjectHooks'; // Assuming this hook exists to fetch projects
import { InventoryItem } from '../../types/Inventory';

const InventoryDashboardPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');

  const { data: projects = [] } = useProjects();
  const { data: allInventory = [], isLoading: isLoadingAll } = useGetAllInventory();
  const { data: projectInventory = [], isLoading: isLoadingProject } = useGetInventoryByProject(
    selectedProjectId as number,
    { enabled: !!selectedProjectId },
  );

  const inventoryData = selectedProjectId ? projectInventory : allInventory;
  const isLoading = selectedProjectId ? isLoadingProject : isLoadingAll;

  const handleProjectChange = (event: any) => {
    setSelectedProjectId(event.target.value as number | '');
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
              value={selectedProjectId}
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

          <Button variant="contained" color="primary" sx={{ mb: 2 }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default InventoryDashboardPage;
