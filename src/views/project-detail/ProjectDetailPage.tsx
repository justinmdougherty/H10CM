import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useParams } from 'react-router'; // Correct import for react-router
import { useGetProjectById } from 'src/hooks/useProjects';

// Import the BatchTrackingComponent if it exists and is needed
// import BatchTrackingComponent from './BatchTrackingComponent';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError, error } = useGetProjectById(projectId);

  // Dynamic Breadcrumb construction
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/dashboard/projects', title: 'Projects Dashboard' },
    {
      title: isLoading
        ? 'Loading Project...'
        : project
        ? project.project_name // Use project_name
        : projectId || 'Project Details',
    },
  ];

  if (isLoading) {
    return (
      <PageContainer title="Loading Project..." description="Loading project details">
        <Breadcrumb title="Loading..." items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Error" description="Error loading project">
        <Breadcrumb title="Error" items={BCrumb} />
        <Typography color="error">
          Error fetching project: {error?.message || 'An unknown error occurred'}
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

  // --- Project Found - Display Details ---

  // NOTE: The BatchTracking logic has been temporarily commented out to focus on the core data display.
  // You can re-enable it once the main details are working correctly.
  // const supportedBatchTypes = ['PR', 'ASSEMBLY'];
  // const projectType = project.project_name;
  // const hasBatchTracking = supportedBatchTypes.includes(projectType.toUpperCase());

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

      {/* <Box mt={4}>
        {!hasBatchTracking && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">
              This project does not have batch tracking functionality enabled.
            </Typography>
          </Paper>
        )}
        {hasBatchTracking && (
           <BatchTrackingComponent projectId={project.project_id} projectType={projectType} />
        )}
      </Box>
      */}
    </PageContainer>
  );
};

export default ProjectDetailPage;
