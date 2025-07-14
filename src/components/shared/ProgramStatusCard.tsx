import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Alert, Divider } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useProgram } from '../../context/ProgramContext';

const ProgramStatusCard: React.FC = () => {
  const { currentProgram, availablePrograms, isLoading, error } = useProgram();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Program Status
        </Typography>

        {isLoading && (
          <Alert severity="info" icon={<InfoIcon />}>
            Loading program information...
          </Alert>
        )}

        {error && (
          <Alert severity="error" icon={<WarningIcon />}>
            Error: {error}
          </Alert>
        )}

        {currentProgram && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SuccessIcon color="success" fontSize="small" />
              <Typography variant="body1" fontWeight={500}>
                Active Program: {currentProgram.program_name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Code: ${currentProgram.program_code}`}
                size="small"
                variant="outlined"
              />
              <Chip label={`ID: ${currentProgram.program_id}`} size="small" variant="outlined" />
              <Chip
                label={currentProgram.is_active ? 'Active' : 'Inactive'}
                size="small"
                color={currentProgram.is_active ? 'success' : 'default'}
              />
            </Box>

            {currentProgram.program_description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentProgram.program_description}
              </Typography>
            )}
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Available Programs: {availablePrograms.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {availablePrograms.map((program) => (
              <Chip
                key={program.program_id}
                label={`${program.program_name} (${program.access_level})`}
                size="small"
                variant={currentProgram?.program_id === program.program_id ? 'filled' : 'outlined'}
                color={currentProgram?.program_id === program.program_id ? 'primary' : 'default'}
              />
            ))}
          </Box>

          {availablePrograms.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              No programs available
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgramStatusCard;
