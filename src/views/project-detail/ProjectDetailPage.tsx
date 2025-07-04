import { Typography, Box, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useParams } from 'react-router';
import {
  useGetProjectById,
  useGetProjectSteps,
  useGetTrackedItems,
} from 'src/hooks/api/useProjectHooks';
import BatchTrackingComponent from './BatchTrackingComponent';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    error: errorProject,
  } = useGetProjectById(projectId);
  const {
    data: steps,
    isLoading: isLoadingSteps,
    isError: isErrorSteps,
    error: errorSteps,
  } = useGetProjectSteps(projectId);
  const {
    data: trackedItems,
    isLoading: isLoadingTrackedItems,
    isError: isErrorTrackedItems,
    error: errorTrackedItems,
  } = useGetTrackedItems(projectId);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/dashboard', title: 'Projects Dashboard' },
    {
      title: isLoadingProject
        ? 'Loading Project...'
        : project
        ? project.project_name
        : projectId || 'Project Details',
    },
  ];

  if (isLoadingProject || isLoadingSteps || isLoadingTrackedItems) {
    return (
      <PageContainer title="Loading Project..." description="Loading project details">
        <Breadcrumb title="Loading..." items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (isErrorProject || isErrorSteps || isErrorTrackedItems) {
    return (
      <PageContainer title="Error" description="Error loading project">
        <Breadcrumb title="Error" items={BCrumb} />
        <Typography color="error">
          Error fetching project:{' '}
          {errorProject?.message ||
            errorSteps?.message ||
            errorTrackedItems?.message ||
            'An unknown error occurred'}
        </Typography>
      </PageContainer>
    );
  }

  if (!project) {
    const notFoundCrumb = [...BCrumb.slice(0, 2), { title: `Project ${projectId} Not Found` }];
    return (
      <PageContainer
        title="Project Not Found"
        description="The requested project could not be found."
      >
        <Breadcrumb title="Not Found" items={notFoundCrumb} />
        <Typography>Project with ID '{projectId}' not found.</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Project: ${project.project_name}`}
      description={`Details for project ${project.project_name}`}
    >
      <Breadcrumb title={project.project_name} items={BCrumb} />

      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          {project.project_name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Description:</strong> {project.project_description}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {project.status}
        </Typography>
        <Typography variant="body1">
          <strong>Date Created:</strong> {new Date(project.date_created).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Last Modified:</strong> {new Date(project.last_modified).toLocaleDateString()}
        </Typography>
      </Box>

      <Box mt={4}>
        <BatchTrackingComponent
          project={project}
          steps={steps || []}
        />
      </Box>
    </PageContainer>
  );
};

export default ProjectDetailPage;
