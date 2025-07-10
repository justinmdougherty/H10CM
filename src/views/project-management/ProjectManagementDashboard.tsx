import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CardActionArea,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  Paper,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  PlayArrow as ActiveIcon,
  Pause as InactiveIcon,
  Schedule as PlanningIcon,
  CheckCircle as CompletedIcon,
  Archive as ArchivedIcon,
  PauseCircle as OnHoldIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as StatsIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Link } from 'react-router';
import { ProjectStatus } from 'src/types/Project';
import {
  useGetProjects,
  useUpdateProject,
  useGetProjectSteps,
} from 'src/hooks/api/useProjectHooks';
import { useTrackedItems } from 'src/hooks/api/useTrackedItemHooks';
import AddProjectModal from '../dashboard/modals/AddProjectModal';

// Enhanced status configuration with better colors and meanings
const getStatusConfig = (status: ProjectStatus) => {
  switch (status) {
    case 'Active':
      return {
        color: 'success' as const,
        icon: <ActiveIcon fontSize="small" />,
        description: 'Production is currently ongoing',
      };
    case 'Inactive':
      return {
        color: 'default' as const,
        icon: <InactiveIcon fontSize="small" />,
        description: 'No current production planned',
      };
    case 'Planning':
      return {
        color: 'info' as const,
        icon: <PlanningIcon fontSize="small" />,
        description: 'Project is being planned',
      };
    case 'Completed':
      return {
        color: 'primary' as const,
        icon: <CompletedIcon fontSize="small" />,
        description: 'All production completed',
      };
    case 'Archived':
      return {
        color: 'secondary' as const,
        icon: <ArchivedIcon fontSize="small" />,
        description: 'Project has been archived',
      };
    case 'On Hold':
      return {
        color: 'warning' as const,
        icon: <OnHoldIcon fontSize="small" />,
        description: 'Production temporarily paused',
      };
    default:
      return {
        color: 'default' as const,
        icon: null,
        description: '',
      };
  }
};

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Project Management' }];

const ProjectManagementDashboard = () => {
  const { data: projects, isLoading, isError, error, refetch } = useGetProjects();
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Update project mutation
  const updateProjectMutation = useUpdateProject();

  const handleAddProjectClick = () => {
    setAddProjectModalOpen(true);
  };

  const handleAddProjectClose = () => {
    setAddProjectModalOpen(false);
  };

  const handleProjectCreated = () => {
    refetch();
    setAddProjectModalOpen(false);
  };

  const handleRefreshClick = () => {
    console.log('🔄 Manual refresh triggered');
    refetch();
  };

  // Status menu handlers
  const handleStatusMenuClick = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setStatusMenuAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!selectedProjectId) return;

    const project = sortedProjects?.find((p) => p.project_id.toString() === selectedProjectId);
    if (!project) return;

    try {
      const updatedProject = { ...project, status: newStatus };
      await updateProjectMutation.mutateAsync(updatedProject);
      // Notification is handled by the useUpdateProject hook
    } catch (error) {
      console.error('Failed to update project status:', error);
      // Error notification is handled by the useUpdateProject hook
    }

    handleStatusMenuClose();
  };

  const statusOptions: ProjectStatus[] = [
    'Active',
    'Inactive',
    'Planning',
    'Completed',
    'Archived',
    'On Hold',
  ];

  if (isLoading) {
    return (
      <PageContainer
        title="Project Management"
        description="Overview and management of all projects"
      >
        <Breadcrumb title="Project Management" items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer
        title="Project Management"
        description="Overview and management of all projects"
      >
        <Breadcrumb title="Project Management" items={BCrumb} />
        <Typography color="error">
          Error fetching projects: {error?.message || 'An unknown error occurred'}
        </Typography>
      </PageContainer>
    );
  }

  // Define status priority order for sorting
  const statusPriority: Record<ProjectStatus, number> = {
    Active: 1,
    Planning: 2,
    Completed: 3,
    'On Hold': 4,
    Inactive: 5,
    Archived: 6,
  };
  // Sort projects by status priority
  const sortedProjects = projects
    ? [...projects].sort((a, b) => {
        const aPriority = statusPriority[a.status] || 999;
        const bPriority = statusPriority[b.status] || 999;

        // If same status priority, sort by project name
        if (aPriority === bPriority) {
          return a.project_name.localeCompare(b.project_name);
        }

        return aPriority - bPriority;
      })
    : [];

  // Calculate overall statistics
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'Active').length || 0;
  const planningProjects = projects?.filter((p) => p.status === 'Planning').length || 0;
  const completedProjects = projects?.filter((p) => p.status === 'Completed').length || 0;

  return (
    <PageContainer title="Project Management" description="Overview and management of all projects">
      <Breadcrumb title="Project Management" items={BCrumb} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Project Management Dashboard
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleRefreshClick} disabled={isLoading} title="Refresh projects">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProjectClick}>
            Add New Project
          </Button>
        </Stack>
      </Stack>

      {/* Overall Statistics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AnalyticsIcon color="primary" />
          <Typography variant="h6">Portfolio Overview</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {totalProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {activeProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main" gutterBottom>
                  {planningProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Planning
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.dark" gutterBottom>
                  {completedProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Projects Grid */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Active Projects
        </Typography>
      </Box>

      <Box>
        <Grid container spacing={3}>
          {sortedProjects && sortedProjects.length > 0 ? (
            sortedProjects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
                onStatusMenuClick={handleStatusMenuClick}
              />
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '200px', textAlign: 'center' }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Projects Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create your first project to get started.
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProjectClick}>
                  Create Your First Project
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Status Change Menu */}
      <Menu
        anchorEl={statusMenuAnchorEl}
        open={Boolean(statusMenuAnchorEl)}
        onClose={handleStatusMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {statusOptions.map((status) => {
          const selectedProject = sortedProjects?.find(
            (p) => p.project_id.toString() === selectedProjectId,
          );
          return (
            <MenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={status === selectedProject?.status || updateProjectMutation.isPending}
            >
              <ListItemIcon>{getStatusConfig(status).icon}</ListItemIcon>
              <ListItemText primary={status} secondary={getStatusConfig(status).description} />
            </MenuItem>
          );
        })}
      </Menu>

      <AddProjectModal
        open={addProjectModalOpen}
        onClose={handleAddProjectClose}
        onSuccess={handleProjectCreated}
      />
    </PageContainer>
  );
};

// Individual Project Card Component with Production Statistics
const ProjectCard = ({
  project,
  onStatusMenuClick,
}: {
  project: any;
  onStatusMenuClick: (event: React.MouseEvent<HTMLElement>, projectId: string) => void;
}) => {
  const { data: trackedItems } = useTrackedItems(project.project_id.toString());
  const { data: projectSteps } = useGetProjectSteps(project.project_id.toString());

  // Calculate project statistics based on step completion
  const projectStats =
    trackedItems && projectSteps
      ? (() => {
          const totalSteps = projectSteps.length;
          const totalUnits = trackedItems.length;

          if (totalSteps === 0 || totalUnits === 0) {
            return {
              totalUnits: 0,
              totalSteps: 0,
              completedSteps: 0,
              averageStepProgress: 0,
              shippedUnits: 0,
            };
          }

          // Count completed steps across all units
          let totalCompletedSteps = 0;
          let shippedUnits = 0;

          trackedItems.forEach((unit) => {
            if (unit.is_shipped) {
              shippedUnits++;
              return;
            }

            const unitStepStatuses = unit.step_statuses || [];
            const completedStepsForUnit = unitStepStatuses.filter(
              (stepStatus) => stepStatus.status === 'Complete',
            ).length;

            totalCompletedSteps += completedStepsForUnit;
          });

          // Calculate average step completion percentage
          const activeUnits = totalUnits - shippedUnits;
          const averageStepProgress =
            activeUnits > 0
              ? Math.round((totalCompletedSteps / (activeUnits * totalSteps)) * 100)
              : 0;

          return {
            totalUnits,
            totalSteps,
            completedSteps: totalCompletedSteps,
            averageStepProgress,
            shippedUnits,
          };
        })()
      : {
          totalUnits: 0,
          totalSteps: 0,
          completedSteps: 0,
          averageStepProgress: 0,
          shippedUnits: 0,
        };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <CardActionArea
            component={Link}
            to={`/project/${project.project_id}`}
            sx={{ flexGrow: 1, p: 0 }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" component="div" gutterBottom>
                {project.project_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '2.5em' }}>
                {project.project_description}
              </Typography>
            </CardContent>
          </CardActionArea>

          {/* Status Menu Button */}
          <IconButton
            size="small"
            onClick={(e) => onStatusMenuClick(e, project.project_id.toString())}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <CardContent sx={{ pt: 0, pb: 2 }}>
          {/* Status Chip */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusConfig(project.status).icon ? (
              <Chip
                icon={getStatusConfig(project.status).icon!}
                label={project.status}
                color={getStatusConfig(project.status).color}
                size="small"
              />
            ) : (
              <Chip
                label={project.status}
                color={getStatusConfig(project.status).color}
                size="small"
              />
            )}
          </Box>

          {/* Production Statistics */}
          {projectStats.totalUnits > 0 && projectStats.totalSteps > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StatsIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={500}>
                  Step Progress
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {projectStats.totalUnits} units • {projectStats.totalSteps} steps each
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {projectStats.averageStepProgress}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={projectStats.averageStepProgress}
                sx={{ mb: 1, height: 6, borderRadius: 3 }}
              />

              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" display="block" align="center" color="primary.main">
                    {projectStats.completedSteps} Steps Complete
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" display="block" align="center" color="info.main">
                    {projectStats.shippedUnits} Units Shipped
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Last Modified */}
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 'auto' }}>
            Modified: {new Date(project.last_modified).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProjectManagementDashboard;
