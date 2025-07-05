import React, { useState, useEffect, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tabs,
  Tab,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { IconPlus, IconTruckDelivery, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import certificateService from '../../services/certificateService';
import { Project } from 'src/types/Project';
import { ProductionUnit, TableColumnConfig, StepStatusType } from 'src/types/Production';
import { AttributeDefinition } from 'src/types/AttributeDefinition';
import { ProjectStep } from 'src/types/ProjectSteps';
import {
  useTrackedItems,
  useCreateTrackedItem,
  useUpdateTrackedItemStepProgress,
  useSaveTrackedItemAttributes,
} from '../../hooks/api/useTrackedItemHooks';
import { useProjectAttributes } from '../../hooks/api/useAttributeDefinitionHooks';

// --- Helper Functions ---
const isUnitComplete = (unit: ProductionUnit): boolean => {
  return (
    unit.step_statuses?.every((ss) => ss.status === 'Complete' || ss.status === 'N/A') ?? false
  );
};

const getUnitOverallCompletionDate = (unit: ProductionUnit): string | undefined => {
  if (!isUnitComplete(unit)) {
    return undefined;
  }
  let latestDate: Date | undefined = undefined;
  unit.step_statuses?.forEach((ss) => {
    if (ss.status === 'Complete' && ss.completedDate) {
      const d = new Date(ss.completedDate);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }
  });

  if (typeof latestDate !== 'undefined') {
    return (latestDate as Date).toISOString();
  } else {
    return undefined;
  }
};

interface BatchTrackingComponentProps {
  project: Project;
  steps: ProjectStep[];
}

const BatchTrackingComponent: React.FC<BatchTrackingComponentProps> = ({ project, steps }) => {
  console.log('🔵 BatchTrackingComponent: Component rendered with props:', { project, steps });

  const queryClient = useQueryClient();

  const { data: projectAttributes } = useProjectAttributes(project.project_id.toString());

  const {
    data: trackedItems,
    isLoading,
    isError,
    error,
  } = useTrackedItems(project.project_id.toString());

  const config = useMemo(() => {
    console.log('🟡 BatchTrackingComponent: Building config with:', {
      project: project.project_name,
      projectType: project.project_type,
      stepsCount: steps.length,
      steps: steps.map((s) => ({ id: s.step_id, name: s.step_name, order: s.step_order })),
      projectAttributesCount: projectAttributes?.length || 0,
      projectAttributes: projectAttributes?.map((attr) => ({
        id: attr.attribute_definition_id,
        name: attr.attribute_name,
        type: attr.attribute_type,
        order: attr.display_order,
      })),
    });

    const baseConfig = {
      projectType: project.project_type,
      displayName: project.project_name,
      steps: steps
        .map((s) => ({ id: s.step_id.toString(), name: s.step_name, order: s.step_order }))
        .sort((a, b) => a.order - b.order),
      unitFields: [],
      snPrefix: {
        unit: project.project_type === 'PR' ? 'PR-' : 'ASSY-',
        pcb: project.project_type === 'PR' ? 'PCB-' : undefined,
      },
    };

    const dynamicColumns: TableColumnConfig[] = (projectAttributes || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((attr: AttributeDefinition) => ({
        id: attr.attribute_definition_id.toString(),
        label: attr.attribute_name,
        width: attr.attribute_name.length > 15 ? '15%' : '12%',
        tabs: ['inProgress', 'completed', 'shipped'],
        render: (unit: ProductionUnit, _attributes?: AttributeDefinition[]) => {
          let attributeValue = '';
          if (unit.attributes) {
            const foundAttr = unit.attributes.find(
              (a: any) => a.attribute_definition_id === attr.attribute_definition_id,
            );
            attributeValue = foundAttr?.attribute_value || '';
          }
          if (!attributeValue) {
            if (
              attr.attribute_name.toLowerCase().includes('unit') &&
              attr.attribute_name.toLowerCase().includes('s/n')
            ) {
              attributeValue = unit.unit_serial_number || `Item ${unit.item_id}`;
            } else if (
              attr.attribute_name.toLowerCase().includes('pcb') &&
              attr.attribute_name.toLowerCase().includes('s/n')
            ) {
              attributeValue = unit.pcb_serial_number || '';
            }
          }
          return (
            <TableCell key={attr.attribute_definition_id}>{attributeValue || 'Not set'}</TableCell>
          );
        },
      }));

    const statusColumns: TableColumnConfig[] = [
      {
        id: 'lastStepCompleted',
        label: 'Last Completed Step',
        width: '15%',
        tabs: ['inProgress', 'completed'],
      },
      {
        id: 'lastCompletedDate',
        label: 'Last Completed Date',
        width: '12%',
        tabs: ['inProgress', 'completed'],
      },
      {
        id: 'lastCompletedBy',
        label: 'Completed By',
        width: '12%',
        tabs: ['inProgress', 'completed'],
      },
      {
        id: 'date_fully_completed',
        label: 'Completion Date',
        width: '12%',
        tabs: ['completed', 'shipped'],
      },
    ];

    const finalConfig = { ...baseConfig, tableColumns: [...dynamicColumns, ...statusColumns] };

    console.log('🟡 BatchTrackingComponent: Final config built:', {
      baseConfig,
      dynamicColumnsCount: dynamicColumns.length,
      dynamicColumns: dynamicColumns.map((col) => ({ id: col.id, label: col.label })),
      statusColumnsCount: statusColumns.length,
      totalColumns: finalConfig.tableColumns.length,
    });

    return finalConfig;
  }, [project, steps, projectAttributes]);

  const saveTrackedItemAttributesMutation = useSaveTrackedItemAttributes();
  const createTrackedItemMutation = useCreateTrackedItem();
  const updateTrackedItemStepProgressMutation = useUpdateTrackedItemStepProgress();

  const markAsShippedMutation = useMutation<void, Error, string[]>({
    mutationFn: async (itemIds: string[]) => {
      // This is a placeholder. You'll need to implement an API call for this.
      console.log('Marking as shipped:', itemIds);
      // Example: await apiClient.post('/tracked-items/ship', { itemIds });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackedItems', project.project_id.toString()] });
    },
  });

  const todayYYYYMMDD = new Date().toISOString().split('T')[0];
  const oneWeekFromTodayYYYYMMDD = new Date(new Date().setDate(new Date().getDate() + 7))
    .toISOString()
    .split('T')[0];

  const [selectedUnits, setSelectedUnits] = useState<Record<string, boolean>>({});
  const [currentStepIdToUpdate, setCurrentStepIdToUpdate] = useState<string>('');
  const [currentStatusToApply, setCurrentStatusToApply] = useState<StepStatusType>('Not Started');
  const [activeTab, setActiveTab] = useState(0);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string>('Loading User...');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUnitDetailModalOpen, setIsUnitDetailModalOpen] = useState(false);
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<ProductionUnit | null>(null);
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  const [editingAttributeValues, setEditingAttributeValues] = useState<Record<string, string>>({});
  const [addUnitsForm, setAddUnitsForm] = useState({
    quantity: 1,
    startUnitSN: '',
    startPcbSN: '',
    batchStartDate: project.date_created
      ? new Date(project.date_created).toISOString().split('T')[0]
      : todayYYYYMMDD,
    batchTargetCompletionDate: oneWeekFromTodayYYYYMMDD,
  });

  useEffect(() => {
    // Keep the detailed unit view in sync with the main list of tracked items.
    // This is important for after an edit, when the trackedItems list is refetched.
    if (selectedUnitForDetail && trackedItems) {
      const freshUnitData = trackedItems.find(
        (item) => item.item_id === selectedUnitForDetail.item_id,
      );
      if (freshUnitData) {
        // Avoid an infinite loop by checking if an update is actually needed.
        if (JSON.stringify(freshUnitData) !== JSON.stringify(selectedUnitForDetail)) {
          setSelectedUnitForDetail(freshUnitData);
        }
      } else {
        // The item is no longer in the list, so close the modal.
        handleCloseUnitDetailModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedItems]);

  const getNextSerialNumber = useMemo(() => {
    if (!trackedItems || trackedItems.length === 0) {
      return `${config.snPrefix.unit}001`;
    }

    const numericParts = trackedItems
      .map((item) => {
        const sn = item.unit_serial_number || '';
        const match = sn.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));

    const maxNumber = numericParts.length > 0 ? Math.max(...numericParts) : 0;
    return `${config.snPrefix.unit}${String(maxNumber + 1).padStart(3, '0')}`;
  }, [trackedItems, config.snPrefix.unit]);

  useEffect(() => {
    if (config.steps.length > 0 && !currentStepIdToUpdate) {
      setCurrentStepIdToUpdate(config.steps[0].id);
    }
  }, [config.steps, currentStepIdToUpdate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await certificateService.getCurrentUser();
        if (user && user.displayName) {
          setCurrentUserDisplayName(user.displayName);
        } else {
          setCurrentUserDisplayName('Unknown User');
        }
      } catch (error) {
        console.error("Error fetching current user for 'Completed By':", error);
        setCurrentUserDisplayName('Error User');
      }
    };
    fetchUser();
  }, []);

  const { inProgressUnits, completedUnits, shippedUnits } = useMemo(() => {
    console.log('🟢 BatchTrackingComponent: Categorizing units from trackedItems:', {
      trackedItemsCount: trackedItems?.length || 0,
      trackedItems: trackedItems?.map((item) => ({
        item_id: item.item_id,
        is_shipped: item.is_shipped,
        unit_serial_number: item.unit_serial_number,
        step_statuses_count: item.step_statuses?.length || 0,
        step_statuses: item.step_statuses,
      })),
    });

    const inProg: ProductionUnit[] = [];
    const comp: ProductionUnit[] = [];
    const ship: ProductionUnit[] = [];

    (trackedItems || []).forEach((unit) => {
      if (unit.is_shipped) {
        ship.push(unit);
        console.log(`🟢 Unit ${unit.item_id} categorized as SHIPPED`);
      } else if (isUnitComplete(unit)) {
        const overallCompletionDate = getUnitOverallCompletionDate(unit);
        comp.push({
          ...unit,
          date_fully_completed: unit.date_fully_completed || overallCompletionDate,
        });
        console.log(`🟢 Unit ${unit.item_id} categorized as COMPLETED`);
      } else {
        inProg.push({ ...unit, date_fully_completed: undefined });
        console.log(`🟢 Unit ${unit.item_id} categorized as IN PROGRESS`);
      }
    });

    const result = { inProgressUnits: inProg, completedUnits: comp, shippedUnits: ship };

    console.log('🟢 BatchTrackingComponent: Unit categorization complete:', {
      inProgressCount: inProg.length,
      completedCount: comp.length,
      shippedCount: ship.length,
      totalProcessed: inProg.length + comp.length + ship.length,
    });

    // Sort each category by the primary identifier
    const sortUnits = (units: ProductionUnit[]) =>
      units.sort((a, b) => {
        const idA = a.unit_serial_number || a.item_id.toString();
        const idB = b.unit_serial_number || b.item_id.toString();
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
      });

    return {
      inProgressUnits: sortUnits(inProg),
      completedUnits: sortUnits(comp),
      shippedUnits: sortUnits(ship),
    };
  }, [trackedItems]);

  const currentVisibleUnits = useMemo(() => {
    let visibleUnits: ProductionUnit[] = [];
    if (activeTab === 0) visibleUnits = inProgressUnits;
    else if (activeTab === 1) visibleUnits = completedUnits;
    else if (activeTab === 2) visibleUnits = shippedUnits;

    console.log('🔴 BatchTrackingComponent: Current visible units for tab', activeTab, ':', {
      tabName: activeTab === 0 ? 'In Progress' : activeTab === 1 ? 'Completed' : 'Shipped',
      visibleUnitsCount: visibleUnits.length,
      visibleUnits: visibleUnits.map((unit) => ({
        item_id: unit.item_id,
        unit_serial_number: unit.unit_serial_number,
        pcb_serial_number: unit.pcb_serial_number,
      })),
    });

    return visibleUnits;
  }, [activeTab, inProgressUnits, completedUnits, shippedUnits]);

  useEffect(() => {
    const newSelected: Record<string, boolean> = {};
    currentVisibleUnits.forEach((unit) => {
      const unitKey = unit.item_id.toString();
      if (selectedUnits[unitKey] !== undefined) {
        newSelected[unitKey] = selectedUnits[unitKey];
      } else if (activeTab === 0 || activeTab === 1) {
        newSelected[unitKey] = true;
      }
    });
    setSelectedUnits(newSelected);
  }, [activeTab, currentVisibleUnits]);

  useEffect(() => {
    setAddUnitsForm((prev) => ({
      ...prev,
      startUnitSN: `${config.snPrefix.unit}${String((trackedItems?.length || 0) + 1).padStart(
        3,
        '0',
      )}`,
      startPcbSN: config.snPrefix.pcb
        ? `${config.snPrefix.pcb}${String((trackedItems?.length || 0) + 1).padStart(3, '0')}`
        : '',
      batchStartDate: project.date_created
        ? new Date(project.date_created).toISOString().split('T')[0]
        : todayYYYYMMDD,
      batchTargetCompletionDate: oneWeekFromTodayYYYYMMDD,
    }));
  }, [trackedItems?.length, project.date_created, config.snPrefix.unit, config.snPrefix.pcb]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log('🔵 BatchTrackingComponent: Tab changed from', activeTab, 'to', newValue);
    setActiveTab(newValue);
  };

  const handleUnitSelectionChange = (unitId: string | number) => {
    const unitKey = unitId.toString();
    setSelectedUnits((prev) => ({ ...prev, [unitKey]: !prev[unitKey] }));
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    unitsToSelect: ProductionUnit[],
  ) => {
    const newSelectedUnits = { ...selectedUnits };
    unitsToSelect.forEach((unit) => {
      const unitKey = unit.item_id.toString();
      newSelectedUnits[unitKey] = event.target.checked;
    });
    setSelectedUnits(newSelectedUnits);
  };

  const handleApplyStatusToSelected = () => {
    const selectedIds = Object.keys(selectedUnits).filter((id) => selectedUnits[id]);
    selectedIds.forEach((itemId) => {
      updateTrackedItemStepProgressMutation.mutate({
        projectId: project.project_id.toString(),
        itemId,
        stepId: currentStepIdToUpdate,
        progress: {
          item_id: itemId,
          step_id: currentStepIdToUpdate,
          status: currentStatusToApply,
          completion_timestamp:
            currentStatusToApply === 'Complete' ? new Date().toISOString() : undefined,
          completed_by_user_name:
            currentStatusToApply === 'Complete' ? currentUserDisplayName : undefined,
        },
      });
    });
  };

  const handleMarkAsShipped = () => {
    const selectedIds = Object.keys(selectedUnits).filter((id) => selectedUnits[id]);
    markAsShippedMutation.mutate(selectedIds);
  };

  const getUnitLastCompletedStepInfo = (
    unit: ProductionUnit,
  ): { name: string; date?: string; completedBy?: string } => {
    let lastCompletedStepName = 'N/A';
    let lastCompletedDate: string | undefined = undefined;
    let lastCompletedBy: string | undefined = undefined;
    let maxOrder = -1;

    if (unit.step_statuses && Array.isArray(unit.step_statuses)) {
      unit.step_statuses.forEach((statusEntry) => {
        if (statusEntry.status === 'Complete') {
          const stepDefinition = config.steps.find((s) => s.id === statusEntry.stepId.toString());
          if (stepDefinition && stepDefinition.order > maxOrder) {
            maxOrder = stepDefinition.order;
            lastCompletedStepName = stepDefinition.name;
            lastCompletedDate = statusEntry.completedDate
              ? new Date(statusEntry.completedDate).toLocaleDateString()
              : undefined;
            lastCompletedBy = statusEntry.completedBy;
          }
        }
      });
    }
    return { name: lastCompletedStepName, date: lastCompletedDate, completedBy: lastCompletedBy };
  };

  const getUnitPrimaryIdentifier = (unit: ProductionUnit): string => {
    if (!unit) return 'N/A';

    const currentTabKey =
      activeTab === 0 ? 'inProgress' : activeTab === 1 ? 'completed' : 'shipped';

    // Find the first column definition for the current tab
    const firstColumn = config.tableColumns.find((col) => col.tabs.includes(currentTabKey));

    if (!firstColumn) {
      // Fallback to a generic display name if no column is found
      return unit.unit_serial_number || `Item #${unit.item_id}`;
    }

    // Logic to extract the value based on the column definition
    // This mirrors the logic used for rendering table cells

    // 1. Check for special, non-attribute columns
    switch (firstColumn.id) {
      case 'lastStepCompleted':
        return getUnitLastCompletedStepInfo(unit).name;
      case 'lastCompletedDate':
        return getUnitLastCompletedStepInfo(unit).date || 'N/A';
      case 'lastCompletedBy':
        return getUnitLastCompletedStepInfo(unit).completedBy || 'N/A';
      case 'date_fully_completed':
        return unit.date_fully_completed
          ? new Date(unit.date_fully_completed).toLocaleDateString()
          : 'N/A';
      // No default case, fall through to attribute check
    }

    // 2. Assume it's an attribute column and find the value
    const attribute = unit.attributes?.find(
      (a: any) => a.attribute_definition_id.toString() === firstColumn.id,
    );

    if (attribute && attribute.attribute_value) {
      return attribute.attribute_value;
    }

    // 3. Fallback if the attribute value is not found
    return unit.unit_serial_number || `Item #${unit.item_id}`;
  };

  const handleOpenAddModal = () => {
    setAddUnitsForm({
      quantity: 1,
      startUnitSN: getNextSerialNumber,
      startPcbSN: config.snPrefix.pcb
        ? `${config.snPrefix.pcb}${String((trackedItems?.length || 0) + 1).padStart(3, '0')}`
        : '',
      batchStartDate: project.date_created
        ? new Date(project.date_created).toISOString().split('T')[0]
        : todayYYYYMMDD,
      batchTargetCompletionDate: oneWeekFromTodayYYYYMMDD,
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenUnitDetailModal = (unit: ProductionUnit) => {
    setSelectedUnitForDetail(unit);
    setIsUnitDetailModalOpen(true);
  };

  const handleCloseUnitDetailModal = () => {
    setIsUnitDetailModalOpen(false);
    setSelectedUnitForDetail(null);
    setIsEditingAttributes(false);
    setEditingAttributeValues({});
  };

  const handleStartEditingAttributes = () => {
    if (!selectedUnitForDetail) return;
    const currentValues: Record<string, string> = {};
    (projectAttributes || []).forEach((attr) => {
      const existingAttr = selectedUnitForDetail.attributes?.find(
        (a: any) => a.attribute_definition_id === attr.attribute_definition_id,
      );
      currentValues[attr.attribute_definition_id.toString()] = existingAttr?.attribute_value || '';
    });
    setEditingAttributeValues(currentValues);
    setIsEditingAttributes(true);
  };

  const handleCancelEditingAttributes = () => {
    setIsEditingAttributes(false);
    setEditingAttributeValues({});
  };

  const handleSaveAttributes = async () => {
    if (!selectedUnitForDetail) return;
    const attributesToSave = Object.entries(editingAttributeValues).map(([key, value]) => ({
      item_id: selectedUnitForDetail.item_id.toString(),
      attribute_definition_id: key,
      attribute_value: value.trim(),
    }));
    console.log(
      '💾 Saving attributes for item',
      selectedUnitForDetail.item_id,
      ':',
      attributesToSave,
    );
    try {
      await saveTrackedItemAttributesMutation.mutateAsync({
        itemId: selectedUnitForDetail.item_id.toString(),
        attributes: attributesToSave,
        projectId: project.project_id.toString(),
      });
      queryClient.invalidateQueries({
        queryKey: ['trackedItems', project.project_id.toString()],
      });
      setIsEditingAttributes(false);
      setEditingAttributeValues({});
      console.log('✅ Attributes saved successfully');
    } catch (err) {
      console.error('Error saving attributes:', err);
      // Ideally, show a user-facing error message here
    }
  };

  const handleAttributeValueChange = (attributeDefinitionId: string, value: string) => {
    setEditingAttributeValues((prev) => ({
      ...prev,
      [attributeDefinitionId]: value,
    }));
  };

  const handlePreviousUnit = () => {
    if (!selectedUnitForDetail) return;
    const currentIndex = currentVisibleUnits.findIndex(
      (u) => u.item_id === selectedUnitForDetail.item_id,
    );
    if (currentIndex > 0) {
      setSelectedUnitForDetail(currentVisibleUnits[currentIndex - 1]);
    }
  };

  const handleNextUnit = () => {
    if (!selectedUnitForDetail) return;
    const currentIndex = currentVisibleUnits.findIndex(
      (u) => u.item_id === selectedUnitForDetail.item_id,
    );
    if (currentIndex < currentVisibleUnits.length - 1) {
      setSelectedUnitForDetail(currentVisibleUnits[currentIndex + 1]);
    }
  };

  const getCurrentUnitPosition = () => {
    if (!selectedUnitForDetail) return { current: 0, total: 0 };
    const currentIndex = currentVisibleUnits.findIndex(
      (u) => u.item_id === selectedUnitForDetail.item_id,
    );
    return {
      current: currentIndex + 1,
      total: currentVisibleUnits.length,
    };
  };

  const handleAddUnitsFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddUnitsForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleAddNewUnits = () => {
    if (addUnitsForm.quantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }
    const currentTrackedItemsCount = trackedItems?.length || 0;
    for (let i = 0; i < addUnitsForm.quantity; i++) {
      const unitSN = `${config.snPrefix.unit}${String(currentTrackedItemsCount + i + 1).padStart(
        3,
        '0',
      )}`;
      const pcbSN = config.snPrefix.pcb
        ? `${config.snPrefix.pcb}${String(currentTrackedItemsCount + i + 1).padStart(3, '0')}`
        : '';
      const unitSnAttr = projectAttributes?.find((attr) => attr.attribute_name === 'Unit S/N');
      const pcbSnAttr = projectAttributes?.find((attr) => attr.attribute_name === 'PCB S/N');
      const newItem = {
        project_id: project.project_id.toString(),
        unit_serial_number: unitSN,
        pcb_serial_number: pcbSN || undefined,
        current_overall_status: 'Pending',
        notes: '',
        attributes: [
          ...(unitSnAttr
            ? [
                {
                  attribute_definition_id: unitSnAttr.attribute_definition_id,
                  attribute_value: unitSN,
                },
              ]
            : []),
          ...(pcbSnAttr
            ? [
                {
                  attribute_definition_id: pcbSnAttr.attribute_definition_id,
                  attribute_value: pcbSN,
                },
              ]
            : []),
        ],
      };
      createTrackedItemMutation.mutate(newItem as any);
    }
    handleCloseAddModal();
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h5">{project.project_name} Batch Tracking</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            {activeTab === 0 && (
              <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="step-select-label">Step to Update</InputLabel>
                  <Select
                    labelId="step-select-label"
                    value={currentStepIdToUpdate}
                    onChange={(e: SelectChangeEvent<string>) =>
                      setCurrentStepIdToUpdate(e.target.value)
                    }
                    label="Step to Update"
                  >
                    {config.steps.map((step) => (
                      <MenuItem key={step.id} value={step.id}>
                        {step.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="status-select-label">Status to Apply</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={currentStatusToApply}
                    onChange={(e: SelectChangeEvent<StepStatusType>) =>
                      setCurrentStatusToApply(e.target.value as StepStatusType)
                    }
                    label="Status to Apply"
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                    <MenuItem value="Blocked">Blocked</MenuItem>
                    <MenuItem value="N/A">N/A</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleApplyStatusToSelected}
                  disabled={Object.values(selectedUnits).every((v) => !v)}
                >
                  Apply to Selected
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`In Progress (${inProgressUnits.length})`} />
          <Tab label={`Completed (${completedUnits.length})`} />
          <Tab label={`Shipped (${shippedUnits.length})`} />
        </Tabs>
      </AppBar>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {activeTab === 0 ? 'In Progress' : activeTab === 1 ? 'Completed' : 'Shipped'} Units
          </Typography>
          <Box>
            {activeTab === 0 && (
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={handleOpenAddModal}
                sx={{ mr: 1 }}
              >
                Add Units
              </Button>
            )}
            {activeTab === 1 && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<IconTruckDelivery />}
                onClick={handleMarkAsShipped}
                disabled={Object.values(selectedUnits).every((v) => !v)}
              >
                Mark Selected as Shipped
              </Button>
            )}
          </Box>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ p: 2 }}>
            Error loading tracked items: {error?.message}
          </Typography>
        ) : (
          <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        Object.values(selectedUnits).some((v) => v) &&
                        !Object.values(selectedUnits).every((v) => v)
                      }
                      checked={
                        currentVisibleUnits.length > 0 &&
                        Object.values(selectedUnits).every((v) => v)
                      }
                      onChange={(e) => handleSelectAllChange(e, currentVisibleUnits)}
                    />
                  </TableCell>
                  {config.tableColumns
                    .filter((col) =>
                      col.tabs.includes(
                        activeTab === 0 ? 'inProgress' : activeTab === 1 ? 'completed' : 'shipped',
                      ),
                    )
                    .map((column) => (
                      <TableCell key={column.id} style={{ width: column.width }}>
                        {column.label}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentVisibleUnits.map((unit) => {
                  const isSelected = selectedUnits[unit.item_id.toString()] || false;
                  const lastStepInfo = getUnitLastCompletedStepInfo(unit);

                  return (
                    <TableRow
                      hover
                      key={unit.item_id}
                      selected={isSelected}
                      onClick={() => handleOpenUnitDetailModal(unit)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleUnitSelectionChange(unit.item_id)}
                        />
                      </TableCell>
                      {config.tableColumns
                        .filter((col) =>
                          col.tabs.includes(
                            activeTab === 0
                              ? 'inProgress'
                              : activeTab === 1
                              ? 'completed'
                              : 'shipped',
                          ),
                        )
                        .map((column) => {
                          if (column.render) {
                            // Pass projectAttributes to the render function
                            return column.render(unit, projectAttributes);
                          }
                          switch (column.id) {
                            case 'lastStepCompleted':
                              return <TableCell key={column.id}>{lastStepInfo.name}</TableCell>;
                            case 'lastCompletedDate':
                              return <TableCell key={column.id}>{lastStepInfo.date}</TableCell>;
                            case 'lastCompletedBy':
                              return (
                                <TableCell key={column.id}>{lastStepInfo.completedBy}</TableCell>
                              );
                            case 'date_fully_completed':
                              return (
                                <TableCell key={column.id}>
                                  {unit.date_fully_completed
                                    ? new Date(unit.date_fully_completed).toLocaleDateString()
                                    : 'N/A'}
                                </TableCell>
                              );
                            default:
                              const attribute = unit.attributes?.find(
                                (a: any) => a.attribute_definition_id.toString() === column.id,
                              );
                              return (
                                <TableCell key={column.id}>
                                  {attribute?.attribute_value || 'Not set'}
                                </TableCell>
                              );
                          }
                        })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Units Modal */}
      <Dialog open={isAddModalOpen} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Units</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Quantity to Add"
                type="number"
                name="quantity"
                value={addUnitsForm.quantity}
                onChange={handleAddUnitsFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Starting Unit S/N"
                name="startUnitSN"
                value={addUnitsForm.startUnitSN}
                onChange={handleAddUnitsFormChange}
                fullWidth
                disabled
              />
            </Grid>
            {config.snPrefix.pcb && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Starting PCB S/N"
                  name="startPcbSN"
                  value={addUnitsForm.startPcbSN}
                  onChange={handleAddUnitsFormChange}
                  fullWidth
                  disabled
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
          <Button onClick={handleAddNewUnits} variant="contained">
            Add Units
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unit Detail Modal */}
      <Dialog
        open={isUnitDetailModalOpen}
        onClose={handleCloseUnitDetailModal}
        maxWidth="md"
        fullWidth
      >
        {selectedUnitForDetail && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Unit Detail: {getUnitPrimaryIdentifier(selectedUnitForDetail)}
                </Typography>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    {`Unit ${getCurrentUnitPosition().current} of ${
                      getCurrentUnitPosition().total
                    }`}
                  </Typography>
                  <Button
                    onClick={handlePreviousUnit}
                    disabled={getCurrentUnitPosition().current <= 1}
                    sx={{ mr: 1 }}
                  >
                    Prev
                  </Button>
                  <Button
                    onClick={handleNextUnit}
                    disabled={getCurrentUnitPosition().current >= getCurrentUnitPosition().total}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Attributes Section */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Attributes
                    </Typography>
                    {!isEditingAttributes && (
                      <Button
                        size="small"
                        onClick={handleStartEditingAttributes}
                        startIcon={<IconEdit />}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {projectAttributes?.map((attr) => {
                        const attrValue = selectedUnitForDetail.attributes?.find(
                          (a: any) => a.attribute_definition_id === attr.attribute_definition_id,
                        )?.attribute_value;

                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={attr.attribute_definition_id}
                          >
                            <Typography variant="subtitle2" color="text.secondary">
                              {attr.attribute_name}
                            </Typography>
                            {isEditingAttributes ? (
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={
                                  editingAttributeValues[attr.attribute_definition_id.toString()] ??
                                  ''
                                }
                                onChange={(e) =>
                                  handleAttributeValueChange(
                                    attr.attribute_definition_id.toString(),
                                    e.target.value,
                                  )
                                }
                              />
                            ) : (
                              <Typography variant="body1" noWrap>
                                {attrValue || 'Not set'}
                              </Typography>
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                    {isEditingAttributes && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveAttributes}
                          startIcon={
                            saveTrackedItemAttributesMutation.isPending ? (
                              <CircularProgress size={20} />
                            ) : (
                              <IconCheck />
                            )
                          }
                          disabled={saveTrackedItemAttributesMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelEditingAttributes}
                          startIcon={<IconX />}
                          disabled={saveTrackedItemAttributesMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Step Progress Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Step Progress
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Step</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Completed Date</TableCell>
                          <TableCell>Completed By</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {config.steps.map((step) => {
                          const statusInfo = selectedUnitForDetail.step_statuses?.find(
                            (s) => s.stepId.toString() === step.id,
                          );
                          return (
                            <TableRow key={step.id}>
                              <TableCell>{step.name}</TableCell>
                              <TableCell>{statusInfo?.status || 'Not Started'}</TableCell>
                              <TableCell>
                                {statusInfo?.completedDate
                                  ? new Date(statusInfo.completedDate).toLocaleDateString()
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>{statusInfo?.completedBy || 'N/A'}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUnitDetailModal}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BatchTrackingComponent;
