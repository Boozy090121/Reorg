import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { copyOrgChart } from '../../features/orgChartSlice';

const PhaseInitializer = ({ phase, factory, onClose }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const currentPhase = useSelector(state => state.phase.currentPhase);
  const orgCharts = useSelector(state => state.orgChart.orgCharts);
  
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };
  
  const handleImportFromCurrent = () => {
    // Only allow importing from current to future or iterative
    if (phase !== 'current' && currentPhase !== phase) {
      dispatch(copyOrgChart({
        sourcePhase: 'current',
        targetPhase: phase,
        factory
      }));
    }
    handleClose();
  };
  
  const handleStartEmpty = () => {
    // No action needed as the chart is already empty
    handleClose();
  };
  
  // Only show for future or iterative phases that are empty
  const shouldShow = phase !== 'current' && 
                    orgCharts[phase][factory].nodes.length === 0;
  
  if (!shouldShow) {
    return null;
  }
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Initialize {phase === 'future' ? 'Future State' : 'Iterative Phase'}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          You are viewing an empty {phase === 'future' ? 'Future State' : 'Iterative Phase'} chart. 
          How would you like to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleImportFromCurrent} color="primary" variant="contained">
          Import from Current State
        </Button>
        <Button onClick={handleStartEmpty} color="secondary">
          Start with Empty Chart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseInitializer;
