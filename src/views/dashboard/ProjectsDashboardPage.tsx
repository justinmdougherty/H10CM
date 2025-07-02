import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CardActionArea,
  CircularProgress,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Link } from 'react-router'; // Using react-router-dom is standard for modern React apps with Vite
import { Project } from 'src/types/Project';
import { useGetProjects } from 'src/hooks/api/useProjectHooks';

const getStatusColor = (
  status: Project['status'],
): 'success' | 'warning' | 'primary' | 'default' => {
  switch (status) {
    case 'Active':
      return 'primary';
    case 'Development':
      return 'warning';
    case 'Completed':
      return 'success';
    default:
      return 'default';
  }
};

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projects Dashboard' }];

const ProjectsDashboardPage = () => {
  const { data: projects, isLoading, isError, error } = useGetProjects();

  if (isLoading) {
    return (
      <PageContainer title="Projects Dashboard" description="Overview of all projects">
        <Breadcrumb title="Projects Dashboard" items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Projects Dashboard" description="Overview of all projects">
        <Breadcrumb title="Projects Dashboard" items={BCrumb} />
        <Typography color="error">
          Error fetching projects: {error?.message || 'An unknown error occurred'}
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Projects Dashboard" description="Overview of all projects">
      <Breadcrumb title="Projects Dashboard" items={BCrumb} />
      <Box>
        <Grid container spacing={3}>
          {projects &&
            projects.map((project) => (
              // FIX: Use project.project_id for the key
              <Grid item xs={12} sm={6} md={4} key={project.project_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea
                    component={Link}
                    // FIX: Use project.project_id for the link
                    to={`/project/${project.project_id}`}
                    sx={{ flexGrow: 1 }}
                  >
                    <CardContent>
                      {/* FIX: Use project.project_name */}
                      <Typography variant="h5" component="div" gutterBottom>
                        {project.project_name}
                      </Typography>
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      {/* FIX: Use project.project_description */}
                      <Typography variant="body2" color="text.secondary">
                        {project.project_description}
                      </Typography>
                      {/* FIX: Use project.last_modified */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 2, display: 'block' }}
                      >
                        Last Modified: {new Date(project.last_modified).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ProjectsDashboardPage;
