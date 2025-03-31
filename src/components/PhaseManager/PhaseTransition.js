import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { setCurrentPhase } from '../../features/phaseSlice';
import { copyOrgChart } from '../../features/orgChartSlice';

const PhaseTransition = () => {
  const dispatch = useDispatch();
  const currentPhase = useSelector(state => state.phase.currentPhase);
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  const [open, setOpen] = React.useState(false);
  const [transitionType, setTransitionType] = React.useState(null);
  
  // Options for transitioning between phases
  const handleOpenTransition = (type) => {
    setTransitionType(type);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setTransitionType(null);
  };
  
  const handleTransition = () => {
    if (transitionType === 'current-to-future') {
      // Copy current state to future state
      dispatch(copyOrgChart({
        sourcePhase: 'current',
        targetPhase: 'future',
        factory: currentFactory
      }));
      
      // Switch to future state
      dispatch(setCurrentPhase('future'));
    } 
    else if (transitionType === 'future-to-iterative') {
      // Copy future state to iterative phase
      dispatch(copyOrgChart({
        sourcePhase: 'future',
        targetPhase: 'iterative',
        factory: currentFactory
      }));
      
      // Switch to iterative phase
      dispatch(setCurrentPhase('iterative'));
    }
    else if (transitionType === 'reset-future') {
      // Create empty future state (by not copying anything)
      dispatch(setCurrentPhase('future'));
    }
    
    handleClose();
  };
  
  const getDialogContent = () => {
    switch (transitionType) {
      case 'current-to-future':
        return {
          title: 'Create Future State from Current',
          content: 'This will copy your current organization structure to the future state. You can then make changes to plan your reorganization. Continue?',
          confirmButton: 'Create Future State'
        };
      case 'future-to-iterative':
        return {
          title: 'Create Iterative Phase from Future State',
          content: 'This will copy your future state organization to the iterative phase for further refinement. Continue?',
          confirmButton: 'Create Iterative Phase'
        };
      case 'reset-future':
        return {
          title: 'Reset Future State',
          content: 'This will clear your future state organization and let you start from scratch. This action cannot be undone. Continue?',
          confirmButton: 'Reset Future State'
        };
      default:
        return {
          title: 'Phase Transition',
          content: 'Confirm phase transition?',
          confirmButton: 'Confirm'
        };
    }
  };
  
  const dialogContent = getDialogContent();
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button 
          variant="outlined" 
          onClick={() => handleOpenTransition('current-to-future')}
          disabled={currentPhase === 'future'}
        >
          Create Future from Current
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleOpenTransition('future-to-iterative')}
          disabled={currentPhase === 'iterative'}
        >
          Create Iterative from Future
        </Button>
        <Button 
          variant="outlined" 
          color="warning"
          onClick={() => handleOpenTransition('reset-future')}
        >
          Reset Future State
        </Button>
      </Box>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleTransition} color="primary" variant="contained">
            {dialogContent.confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhaseTransition;
