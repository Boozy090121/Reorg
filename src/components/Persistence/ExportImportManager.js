import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { saveAppState } from '../../features/persistenceSlice';

const ExportImportManager = () => {
  const dispatch = useDispatch();
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Get all state from Redux
  const state = useSelector(state => ({
    phase: state.phase,
    roles: state.roles,
    personnel: state.personnel,
    orgChart: state.orgChart,
    focusFactory: state.focusFactory
  }));
  
  // Handle export dialog open
  const handleOpenExport = () => {
    setOpenExport(true);
  };
  
  // Handle export dialog close
  const handleCloseExport = () => {
    setOpenExport(false);
  };
  
  // Handle import dialog open
  const handleOpenImport = () => {
    setOpenImport(true);
    setImportData(null);
    setImportError(null);
  };
  
  // Handle import dialog close
  const handleCloseImport = () => {
    setOpenImport(false);
  };
  
  // Handle export configuration
  const handleExport = () => {
    try {
      // Create export data
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: state
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger click
      const a = document.createElement('a');
      a.href = url;
      a.download = `quality-reorg-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      handleCloseExport();
    } catch (error) {
      console.error('Error exporting configuration:', error);
    }
  };
  
  // Handle file selection for import
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate import data
        if (!data.version || !data.timestamp || !data.data) {
          setImportError('Invalid file format. Missing required fields.');
          return;
        }
        
        // Check version compatibility
        if (data.version !== '1.0') {
          setImportError(`Unsupported version: ${data.version}. Current version: 1.0`);
          return;
        }
        
        // Validate data structure
        const requiredKeys = ['phase', 'roles', 'personnel', 'orgChart', 'focusFactory'];
        const missingKeys = requiredKeys.filter(key => !data.data[key]);
        
        if (missingKeys.length > 0) {
          setImportError(`Invalid data structure. Missing: ${missingKeys.join(', ')}`);
          return;
        }
        
        setImportData(data);
        setImportError(null);
      } catch (error) {
        console.error('Error parsing import file:', error);
        setImportError('Error parsing file. Please ensure it is a valid JSON file.');
      }
    };
    
    reader.readAsText(file);
  };
  
  // Handle import confirmation
  const handleImport = () => {
    if (!importData) return;
    
    try {
      // Import each slice of state
      Object.entries(importData.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      // Show success message
      setImportSuccess(true);
      
      // Reload the application to apply imported state
      window.location.reload();
    } catch (error) {
      console.error('Error importing configuration:', error);
      setImportError('Error applying imported configuration.');
    }
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<FileDownloadIcon />}
          onClick={handleOpenExport}
        >
          Export
        </Button>
        
        <Button 
          variant="outlined" 
          startIcon={<FileUploadIcon />}
          onClick={handleOpenImport}
        >
          Import
        </Button>
      </Box>
      
      {/* Export Dialog */}
      <Dialog open={openExport} onClose={handleCloseExport}>
        <DialogTitle>Export Configuration</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Export your current configuration to a file. This includes:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary="All phases (current state, future state, iterative)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary="Focus factory settings" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary="Roles and responsibilities" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary="Personnel assignments" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary="Organization chart structure" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The exported file can be imported later to restore your configuration.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExport}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">Export</Button>
        </DialogActions>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={openImport} onClose={handleCloseImport}>
        <DialogTitle>Import Configuration</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Import a previously exported configuration file.
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            Select File
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          
          {importData && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                File validated successfully!
              </Alert>
              
              <Typography variant="subtitle2">
                Import Details:
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Export Date" 
                    secondary={new Date(importData.timestamp).toLocaleString()} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Version" 
                    secondary={importData.version} 
                  />
                </ListItem>
              </List>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Warning: Importing will replace your current configuration. This action cannot be undone.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImport}>Cancel</Button>
          <Button 
            onClick={handleImport} 
            variant="contained" 
            disabled={!importData || !!importError}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbars */}
      <Snackbar
        open={exportSuccess}
        autoHideDuration={6000}
        onClose={() => setExportSuccess(false)}
      >
        <Alert severity="success" onClose={() => setExportSuccess(false)}>
          Configuration exported successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={importSuccess}
        autoHideDuration={6000}
        onClose={() => setImportSuccess(false)}
      >
        <Alert severity="success" onClose={() => setImportSuccess(false)}>
          Configuration imported successfully! Reloading application...
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportImportManager;
