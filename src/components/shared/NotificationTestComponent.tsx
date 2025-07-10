import React from 'react';
import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import { notifications, projectNotifications } from '../../services/notificationService';

const NotificationTestComponent: React.FC = () => {
  const handleTestSuccess = () => {
    notifications.success('Success! The notification system is working perfectly!');
  };

  const handleTestError = () => {
    notifications.error('Error notification test - this shows how errors will appear');
  };

  const handleTestWarning = () => {
    notifications.warning('Warning! Low stock detected for Test Part (5 remaining)');
  };

  const handleTestInfo = () => {
    notifications.info('Info: Project status has been updated to Active');
  };

  const handleTestProjectCreated = () => {
    projectNotifications.projectCreated('Test Project Alpha');
  };

  const handleTestStatusUpdate = () => {
    projectNotifications.statusUpdated('Manufacturing Unit Beta', 'Active');
  };

  const handleTestLowStock = () => {
    projectNotifications.inventoryLowStock('Resistor 10K Ohm', 3, 10);
  };

  const handleTestStepCompleted = () => {
    projectNotifications.stepCompleted('Project Gamma', 'Assembly Complete', 5);
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom color="primary">
        🎉 Notification System Test Panel
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Click the buttons below to test different notification types. They should appear in the
        top-right corner!
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h6" color="text.primary">
          Basic Notifications:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" color="success" onClick={handleTestSuccess}>
            Test Success
          </Button>
          <Button variant="contained" color="error" onClick={handleTestError}>
            Test Error
          </Button>
          <Button variant="contained" color="warning" onClick={handleTestWarning}>
            Test Warning
          </Button>
          <Button variant="contained" color="info" onClick={handleTestInfo}>
            Test Info
          </Button>
        </Box>

        <Typography variant="h6" color="text.primary" sx={{ mt: 3 }}>
          Project-Specific Notifications:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={handleTestProjectCreated}>
            Project Created
          </Button>
          <Button variant="outlined" onClick={handleTestStatusUpdate}>
            Status Updated
          </Button>
          <Button variant="outlined" onClick={handleTestLowStock}>
            Low Stock Alert
          </Button>
          <Button variant="outlined" onClick={handleTestStepCompleted}>
            Step Completed
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          💡 <strong>Pro Tip:</strong> These notifications will automatically appear when you:
          <br />• Create or update projects
          <br />• Complete manufacturing steps
          <br />• Adjust inventory levels
          <br />• Encounter errors in the application
        </Typography>
      </Stack>
    </Paper>
  );
};

export default NotificationTestComponent;
