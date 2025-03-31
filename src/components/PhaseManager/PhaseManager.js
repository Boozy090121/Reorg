import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { setCurrentPhase, updatePhaseLastModified } from '../../features/phaseSlice';

const PhaseManager = () => {
  const dispatch = useDispatch();
  const { currentPhase, phases } = useSelector(state => state.phase);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [targetPhase, setTargetPhase] = React.useState(null);
  const [unsavedChanges, setUnsavedChanges] = React.useState(false);
  
  // This would be connected to actual data changes in a full implementation
  useEffect(() => {
    // Simulate detecting changes
    const timer = setTimeout(() => {
      setUnsavedChanges(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentPhase]);
  
  const handlePhaseChange = (event, newPhase) => {
    if (unsavedChanges) {
      // Show confirmation dialog before switching
      setTargetPhase(newPhase);
      setOpenDialog(true);
    } else {
      // Switch directly if no unsaved changes
      dispatch(setCurrentPhase(newPhase));
    }
  };
  
  const handleConfirmSwitch = () => {
    // Save current phase data (in a real implementation)
    dispatch(updatePhaseLastModified({ phase: currentPhase }));
    
    // Switch to target phase
    dispatch(setCurrentPhase(targetPhase));
    
    // Reset unsaved changes flag
    setUnsavedChanges(false);
    
    // Close dialog
    setOpenDialog(false);
  };
  
  const handleCancelSwitch = () => {
    setOpenDialog(false);
    setTargetPhase(null);
  };
  
  const handleSave = () => {
    // Save current phase data
    dispatch(updatePhaseLastModified({ phase: currentPhase }));
    setUnsavedChanges(false);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <Tabs
            value={currentPhase}
            onChange={handlePhaseChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="phase tabs"
          >
            <Tab 
              label="Current State" 
              value="current" 
              icon={unsavedChanges && currentPhase === 'current' ? '•' : null}
              iconPosition="end"
            />
            <Tab 
              label="Future State" 
              value="future" 
              icon={unsavedChanges && currentPhase === 'future' ? '•' : null}
              iconPosition="end"
            />
            <Tab 
              label="Iterative Phase" 
              value="iterative" 
              icon={unsavedChanges && currentPhase === 'iterative' ? '•' : null}
              iconPosition="end"
            />
          </Tabs>
          
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
              disabled={!unsavedChanges}
            >
              Save
            </Button>
            <Button variant="outlined">Export</Button>
          </Box>
        </Box>
        
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {phases[currentPhase].lastModified 
              ? `Last modified: ${new Date(phases[currentPhase].lastModified).toLocaleString()}` 
              : 'Not yet saved'}
            {unsavedChanges && ' (unsaved changes)'}
          </Typography>
        </Box>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelSwitch}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes in the current phase. Would you like to save before switching?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSwitch}>Cancel</Button>
          <Button onClick={() => {
            handleSave();
            handleConfirmSwitch();
          }}>
            Save & Switch
          </Button>
          <Button onClick={handleConfirmSwitch} color="warning">
            Switch Without Saving
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhaseManager;
