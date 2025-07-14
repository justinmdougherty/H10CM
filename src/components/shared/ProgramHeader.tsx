import React from 'react';
import { Box, Typography, Chip, Breadcrumbs, Alert, CircularProgress } from '@mui/material';
import { Business as ProgramIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useProgram } from '../../context/ProgramContext';

interface ProgramHeaderProps {
  showBreadcrumb?: boolean;
  dense?: boolean;
}

const ProgramHeader: React.FC<ProgramHeaderProps> = ({ showBreadcrumb = true, dense = false }) => {
  const { currentProgram, isLoading, error } = useProgram();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: dense ? 0.5 : 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="text.secondary">
          Loading program...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" icon={<ErrorIcon fontSize="inherit" />} sx={{ py: 0.5 }}>
        <Typography variant="caption">Program Error: {error}</Typography>
      </Alert>
    );
  }

  if (!currentProgram) {
    return (
      <Alert severity="info" sx={{ py: 0.5 }}>
        <Typography variant="caption">No program selected</Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ py: dense ? 0.5 : 1 }}>
      {showBreadcrumb && (
        <Breadcrumbs sx={{ mb: 1 }} separator="›">
          <Typography variant="caption" color="text.secondary">
            Programs
          </Typography>
          <Typography variant="caption" color="primary.main">
            {currentProgram.program_name}
          </Typography>
        </Breadcrumbs>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ProgramIcon color="primary" fontSize="small" />
        <Typography variant={dense ? 'caption' : 'body2'} fontWeight={500} color="primary.main">
          {currentProgram.program_name}
        </Typography>
        <Chip
          label={currentProgram.program_code}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ height: dense ? 18 : 24, fontSize: dense ? '0.65rem' : '0.75rem' }}
        />
        {currentProgram.is_active && (
          <Chip
            label="Active"
            size="small"
            color="success"
            sx={{ height: dense ? 18 : 24, fontSize: dense ? '0.65rem' : '0.75rem' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProgramHeader;
