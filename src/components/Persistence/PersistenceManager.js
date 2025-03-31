import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  Switch, 
  FormControlLabel,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { 
  saveAppState, 
  toggleAutoSave, 
  setSaveTimestamp,
  setSaveError,
  setLoadError
} from '../../features/persistenceSlice';
import ExportImportManager from './ExportImportManager';

const PersistenceManager = () => {
  const dispatch = useDispatch();
  const { 
    lastSaved, 
    autoSaveEnabled, 
    autoSaveInterval, 
    saveInProgress, 
    saveError, 
    loadError 
  } = useSelector(state => state.persistence);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Handle manual save
  const handleSave = () => {
    dispatch(saveAppState());
  };
  
  // Toggle auto-save
  const handleToggleAutoSave = () => {
    dispatch(toggleAutoSave());
  };
  
  // Auto-save effect
  useEffect(() => {
    let autoSaveTimer;
    
    if (autoSaveEnabled) {
      autoSaveTimer = setInterval(() => {
        dispatch(saveAppState());
      }, autoSaveInterval);
    }
    
    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
      }
    };
  }, [autoSaveEnabled, autoSaveInterval, dispatch]);
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Data Persistence</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoSaveEnabled}
                onChange={handleToggleAutoSave}
                color="primary"
              />
            }
            label="Auto-save"
          />
          
          <Tooltip title="Save now">
            <IconButton 
              onClick={handleSave}
              disabled={saveInProgress}
              color="primary"
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        {lastSaved ? (
          <CloudDoneIcon color="success" sx={{ mr: 1 }} />
        ) : (
          <CloudOffIcon color="warning" sx={{ mr: 1 }} />
        )}
        
        <Typography variant="body2" color="text.secondary">
          Last saved: {formatTimestamp(lastSaved)}
          {autoSaveEnabled && ' (Auto-save enabled)'}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">Export/Import Configuration</Typography>
        <ExportImportManager />
      </Box>
      
      {/* Error Snackbars */}
      <Snackbar 
        open={!!saveError} 
        autoHideDuration={6000} 
        onClose={() => dispatch(setSaveError(null))}
      >
        <Alert severity="error" onClose={() => dispatch(setSaveError(null))}>
          Error saving data: {saveError}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!loadError} 
        autoHideDuration={6000} 
        onClose={() => dispatch(setLoadError(null))}
      >
        <Alert severity="error" onClose={() => dispatch(setLoadError(null))}>
          Error loading data: {loadError}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PersistenceManager;
