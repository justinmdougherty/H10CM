import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface SystemSetupProps {
  onSetupComplete?: () => void;
}

const SystemSetup: React.FC<SystemSetupProps> = ({ onSetupComplete: _onSetupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [setupStatus, setSetupStatus] = useState<any>({});

  // Program creation state
  const [createProgramOpen, setCreateProgramOpen] = useState(false);
  const [programForm, setProgramForm] = useState({
    program_name: 'Operations',
    program_code: 'TF',
    program_description: 'Operations management and inventory tracking',
  });

  // User creation state
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    user_name: 'justin.dougherty',
    display_name: 'Justin Dougherty',
    email: 'justin.dougherty@example.com',
    certificate_subject:
      'CN=DOUGHERTY.JUSTIN.MICHAEL.1250227228,OU=USN,OU=PKI,OU=DoD,O=U.S. Government,C=US',
    is_system_admin: true,
    program_access_level: 'Admin' as 'Read' | 'Write' | 'Admin',
  });

  const [alerts, setAlerts] = useState<
    Array<{ type: 'success' | 'error' | 'warning' | 'info'; message: string }>
  >([]);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const addAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlerts((prev) => [...prev, { type, message }]);
    setTimeout(() => {
      setAlerts((prev) => prev.slice(1));
    }, 5000);
  };

  const checkSystemStatus = async () => {
    setLoading(true);
    try {
      // Check if programs exist
      const programsResponse = await fetch('/api/programs');
      const programsData = await programsResponse.json();
      setPrograms(Array.isArray(programsData) ? programsData : []);

      // Check if users exist
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Determine setup status
      const defaultProgram = programsData.find((p: any) => p.program_code === 'TF');
      const adminUser = usersData.find((u: any) => u.is_system_admin);

      setSetupStatus({
        hasDefaultProgram: !!defaultProgram,
        hasAdminUser: !!adminUser,
        programCount: programsData.length,
        userCount: usersData.length,
        defaultProgram,
        adminUser,
      });

      // Set active step based on what's missing
      if (!defaultProgram) {
        setActiveStep(0);
      } else if (!adminUser) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    } catch (error) {
      console.error('Error checking system status:', error);
      addAlert('error', 'Failed to check system status');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProgram = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programForm),
      });

      if (response.ok) {
        addAlert('success', 'Program created successfully!');
        setCreateProgramOpen(false);
        checkSystemStatus();
        setActiveStep(1);
      } else {
        const errorData = await response.json();
        addAlert('error', `Failed to create program: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating program:', error);
      addAlert('error', 'Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async () => {
    setLoading(true);
    try {
      // First create the user in the database using direct SQL
      const createUserResponse = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (createUserResponse.ok) {
        // Then grant program access if program exists
        if (setupStatus.defaultProgram) {
          const grantAccessResponse = await fetch(
            `/api/programs/${setupStatus.defaultProgram.program_id}/access`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: userForm.user_name, // This would be the user_id from the created user
                access_level: userForm.program_access_level,
              }),
            },
          );

          if (!grantAccessResponse.ok) {
            addAlert('warning', 'User created but failed to grant program access');
          }
        }

        addAlert('success', 'Admin user created successfully!');
        setCreateUserOpen(false);
        checkSystemStatus();
        setActiveStep(2);
      } else {
        const errorData = await createUserResponse.json();
        addAlert('error', `Failed to create user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      addAlert('error', 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  const setupSteps = [
    {
      label: 'Create Program',
      description: 'Set up the primary program for multi-tenant data isolation',
      completed: setupStatus.hasDefaultProgram,
      action: () => setCreateProgramOpen(true),
      buttonText: 'Create Program',
      content: setupStatus.defaultProgram ? (
        <Alert severity="success" icon={<CheckIcon />}>
          Program already exists: {setupStatus.defaultProgram.program_name} (ID:{' '}
          {setupStatus.defaultProgram.program_id})
        </Alert>
      ) : (
        <Alert severity="warning" icon={<WarningIcon />}>
          Program not found. Click "Create Program" to set up a program.
        </Alert>
      ),
    },
    {
      label: 'Create Admin User',
      description:
        'Add your user account with certificate authentication and system admin privileges',
      completed: setupStatus.hasAdminUser,
      action: () => setCreateUserOpen(true),
      buttonText: 'Create Admin User',
      content: setupStatus.hasAdminUser ? (
        <Alert severity="success" icon={<CheckIcon />}>
          System admin user exists: {setupStatus.adminUser?.display_name}
        </Alert>
      ) : (
        <Alert severity="warning" icon={<WarningIcon />}>
          No system admin user found. Click "Create Admin User" to add your account.
        </Alert>
      ),
    },
    {
      label: 'Setup Complete',
      description: 'System is ready for multi-tenant operations',
      completed: setupStatus.hasDefaultProgram && setupStatus.hasAdminUser,
      content:
        setupStatus.hasDefaultProgram && setupStatus.hasAdminUser ? (
          <Alert severity="success" icon={<CheckIcon />}>
            System setup complete! You can now access all features with proper program isolation.
          </Alert>
        ) : (
          <Alert severity="info">Complete the previous steps to finish system setup.</Alert>
        ),
    },
  ];

  if (loading && Object.keys(setupStatus).length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Checking system status...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon />
        System Setup
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the H10CM system with proper multi-tenant architecture.
      </Typography>

      {/* Alerts */}
      {alerts.map((alert, index) => (
        <Alert key={index} severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      ))}

      {/* System Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <BusinessIcon />
                Programs
              </Typography>
              <Typography
                variant="h4"
                color={setupStatus.hasDefaultProgram ? 'success.main' : 'warning.main'}
              >
                {setupStatus.programCount || 0}
              </Typography>
              <Typography variant="caption">
                {setupStatus.hasDefaultProgram ? 'Program Ready' : 'Program Missing'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PersonIcon />
                Users
              </Typography>
              <Typography
                variant="h4"
                color={setupStatus.hasAdminUser ? 'success.main' : 'warning.main'}
              >
                {setupStatus.userCount || 0}
              </Typography>
              <Typography variant="caption">
                {setupStatus.hasAdminUser ? 'Admin User Ready' : 'Admin User Missing'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Setup Steps */}
      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {setupSteps.map((step, _index) => (
              <Step key={step.label} completed={step.completed}>
                <StepLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {step.label}
                    {step.completed && <Chip label="Complete" size="small" color="success" />}
                  </Box>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  {step.content}
                  {!step.completed && step.action && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={step.action}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
                      >
                        {step.buttonText}
                      </Button>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Current System State */}
      {(programs.length > 0 || users.length > 0) && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current System State
            </Typography>

            {programs.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Programs ({programs.length})
                </Typography>
                <List dense>
                  {programs.map((program) => (
                    <ListItem key={program.program_id}>
                      <ListItemIcon>
                        <BusinessIcon
                          color={program.program_code === 'TF' ? 'primary' : 'inherit'}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${program.program_name} (${program.program_code})`}
                        secondary={`ID: ${program.program_id} | ${
                          program.program_description || 'No description'
                        }`}
                      />
                      {program.program_code === 'TF' && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {users.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Users ({users.length})
                </Typography>
                <List dense>
                  {users.slice(0, 5).map((user) => (
                    <ListItem key={user.user_id}>
                      <ListItemIcon>
                        <PersonIcon color={user.is_system_admin ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.display_name || user.user_name}
                        secondary={`${user.email || 'No email'} | ${
                          user.is_system_admin ? 'System Admin' : 'User'
                        }`}
                      />
                      {user.is_system_admin && <Chip label="Admin" color="primary" size="small" />}
                    </ListItem>
                  ))}
                </List>
                {users.length > 5 && (
                  <Typography variant="caption" color="text.secondary">
                    And {users.length - 5} more users...
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Program Dialog */}
      <Dialog
        open={createProgramOpen}
        onClose={() => setCreateProgramOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Program</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Program Name"
              value={programForm.program_name}
              onChange={(e) =>
                setProgramForm((prev) => ({ ...prev, program_name: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Program Code"
              value={programForm.program_code}
              onChange={(e) =>
                setProgramForm((prev) => ({ ...prev, program_code: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={programForm.program_description}
              onChange={(e) =>
                setProgramForm((prev) => ({ ...prev, program_description: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateProgramOpen(false)}>Cancel</Button>
          <Button onClick={createDefaultProgram} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Create Program'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Admin User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              value={userForm.user_name}
              onChange={(e) => setUserForm((prev) => ({ ...prev, user_name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Display Name"
              value={userForm.display_name}
              onChange={(e) => setUserForm((prev) => ({ ...prev, display_name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Certificate Subject"
              multiline
              rows={2}
              value={userForm.certificate_subject}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, certificate_subject: e.target.value }))
              }
              sx={{ mb: 2 }}
              helperText="This should match your DoD certificate subject"
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Program Access Level</InputLabel>
              <Select
                value={userForm.program_access_level}
                onChange={(e) =>
                  setUserForm((prev) => ({ ...prev, program_access_level: e.target.value as any }))
                }
                label="Program Access Level"
              >
                <MenuItem value="Read">Read</MenuItem>
                <MenuItem value="Write">Write</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserOpen(false)}>Cancel</Button>
          <Button onClick={createAdminUser} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSetup;
