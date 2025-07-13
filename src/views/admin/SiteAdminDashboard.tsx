import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Alert,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  People as UsersIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useRBAC } from '../../context/RBACContext';
import UserManagementDashboard from '../../components/admin/UserManagementDashboard';
import LoginComponent from '../../components/auth/LoginComponent';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Site Administration' }];

const SiteAdminDashboard: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    getAllUsers,
    getPendingAccessRequests,
    approveUserAccess,
    denyUserAccess,
    updateUserRole,
    suspendUser,
    activateUser,
    hasRole,
  } = useRBAC();

  const [currentTab, setCurrentTab] = useState(0);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!isAuthenticated || !hasRole('Admin')) return;

      setIsLoadingData(true);
      try {
        const [users, requests] = await Promise.all([getAllUsers(), getPendingAccessRequests()]);
        setAllUsers(users);
        setPendingRequests(requests);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAdminData();
  }, [isAuthenticated, hasRole, getAllUsers, getPendingAccessRequests]);

  // Show loading state
  if (isLoading) {
    return (
      <PageContainer
        title="Site Administration"
        description="System administration and user management"
      >
        <Breadcrumb title="Site Administration" items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <PageContainer
        title="Site Administration"
        description="System administration and user management"
      >
        <Breadcrumb title="Site Administration" items={BCrumb} />
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Administrator authentication required to access site administration features.
          </Alert>
          <LoginComponent
            onLoginSuccess={(user) => {
              console.log('Admin logged in:', user.full_name);
            }}
          />
        </Box>
      </PageContainer>
    );
  }

  // Check admin permissions
  if (!hasRole('Admin')) {
    return (
      <PageContainer
        title="Site Administration"
        description="System administration and user management"
      >
        <Breadcrumb title="Site Administration" items={BCrumb} />
        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            Only administrators can access the Site Administration dashboard. Current role:{' '}
            {currentUser?.role || 'Unknown'}
          </Typography>
        </Alert>
      </PageContainer>
    );
  }

  const getSystemStats = () => {
    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.status === 'Active').length,
      pendingApprovals: pendingRequests.length,
      adminUsers: allUsers.filter((u) => u.role === 'Admin').length,
      recentActivity: allUsers.filter(
        (u) => u.last_login && new Date(u.last_login) > new Date(Date.now() - 24 * 60 * 60 * 1000),
      ).length,
    };
    return stats;
  };

  const stats = getSystemStats();

  return (
    <PageContainer
      title="Site Administration"
      description="System administration and user management"
    >
      <Breadcrumb title="Site Administration" items={BCrumb} />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AdminIcon color="primary" />
            Site Administration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {currentUser?.full_name}
          </Typography>
        </Box>
        <Badge badgeContent={stats.pendingApprovals} color="warning">
          <NotificationIcon />
        </Badge>
      </Stack>

      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">
                {stats.totalUsers}
              </Typography>
              <Typography variant="caption">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main">
                {stats.activeUsers}
              </Typography>
              <Typography variant="caption">Active Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main">
                {stats.pendingApprovals}
              </Typography>
              <Typography variant="caption">Pending Approvals</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error.main">
                {stats.adminUsers}
              </Typography>
              <Typography variant="caption">Administrators</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info.main">
                {stats.recentActivity}
              </Typography>
              <Typography variant="caption">Active Today</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab
              label={
                <Badge badgeContent={stats.pendingApprovals} color="warning">
                  User Management
                </Badge>
              }
              icon={<UsersIcon />}
            />
            <Tab label="System Security" icon={<SecurityIcon />} />
            <Tab label="System Settings" icon={<SettingsIcon />} />
            <Tab label="Analytics" icon={<AnalyticsIcon />} />
          </Tabs>
        </Box>

        {/* User Management Tab */}
        <TabPanel value={currentTab} index={0}>
          {isLoadingData ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <UserManagementDashboard
              currentUser={currentUser!}
              allUsers={allUsers}
              pendingAccessRequests={pendingRequests}
              onApproveUser={async (userId, role, notes) => {
                await approveUserAccess(userId, role, notes);
                // Reload data
                const [users, requests] = await Promise.all([
                  getAllUsers(),
                  getPendingAccessRequests(),
                ]);
                setAllUsers(users);
                setPendingRequests(requests);
              }}
              onDenyUser={async (userId, notes) => {
                await denyUserAccess(userId, notes);
                // Reload data
                const requests = await getPendingAccessRequests();
                setPendingRequests(requests);
              }}
              onUpdateUserRole={async (userId, newRole) => {
                await updateUserRole(userId, newRole);
                // Reload data
                const users = await getAllUsers();
                setAllUsers(users);
              }}
              onSuspendUser={async (userId, reason) => {
                await suspendUser(userId, reason);
                // Reload data
                const users = await getAllUsers();
                setAllUsers(users);
              }}
              onActivateUser={async (userId) => {
                await activateUser(userId);
                // Reload data
                const users = await getAllUsers();
                setAllUsers(users);
              }}
              onUpdateUserPermissions={async (userId, permissions) => {
                // Implement if needed
                console.log('Update permissions for user:', userId, permissions);
              }}
            />
          )}
        </TabPanel>

        {/* System Security Tab */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            System Security
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Certificate Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Certificate-based authentication is enabled for administrator access.
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Status: Active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Role-Based Access Control
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    RBAC system with 4 role levels: Admin, ProjectManager, Technician, Visitor.
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Status: Active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Settings Tab */}
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>
            System Settings
          </Typography>
          <Alert severity="info">
            System settings configuration will be available in a future update.
          </Alert>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" gutterBottom>
            System Analytics
          </Typography>
          <Alert severity="info">
            System analytics and reporting will be available in a future update.
          </Alert>
        </TabPanel>
      </Card>
    </PageContainer>
  );
};

export default SiteAdminDashboard;
