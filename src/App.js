import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import StateComparisonTool from './components/StateComparisonTool';
import ReportsAndAnalytics from './components/ReportsAndAnalytics';
import { EnhancedDragDropProvider } from './utils/DragDropUtils';
import { generateFactoryTemplate } from './components/FocusFactory/FocusFactoryTemplates';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Initial data
const initialData = {
  currentPhase: 'current',
  focusFactory: 'ADD',
  roles: {
    'role-1': { id: 'role-1', title: 'Quality Manager', responsibilities: ['Overall quality oversight', 'Strategic planning'] },
    'role-2': { id: 'role-2', title: 'Quality Engineer', responsibilities: ['Process improvement', 'Quality control'] },
    'role-3': { id: 'role-3', title: 'Quality Analyst', responsibilities: ['Data analysis', 'Reporting'] },
    'role-4': { id: 'role-4', title: 'Quality Inspector', responsibilities: ['Product inspection', 'Defect identification'] },
    'role-5': { id: 'role-5', title: 'Quality Technician', responsibilities: ['Testing', 'Sample collection'] },
  },
  personnel: {
    'person-1': { id: 'person-1', name: 'John Smith', skills: ['Leadership', 'Strategic planning'] },
    'person-2': { id: 'person-2', name: 'Jane Doe', skills: ['Process improvement', 'Six Sigma'] },
    'person-3': { id: 'person-3', name: 'Robert Johnson', skills: ['Data analysis', 'Statistical methods'] },
    'person-4': { id: 'person-4', name: 'Emily Williams', skills: ['Inspection', 'Attention to detail'] },
    'person-5': { id: 'person-5', name: 'Michael Brown', skills: ['Testing', 'Documentation'] },
  },
  orgChart: {
    current: {
      ADD: generateFactoryTemplate('ADD'),
      BBV: generateFactoryTemplate('BBV'),
      SYN: generateFactoryTemplate('SYN')
    },
    future: {
      ADD: generateFactoryTemplate('ADD'),
      BBV: generateFactoryTemplate('BBV'),
      SYN: generateFactoryTemplate('SYN')
    }
  },
  assignments: {
    current: {
      ADD: {},
      BBV: {},
      SYN: {}
    },
    future: {
      ADD: {},
      BBV: {},
      SYN: {}
    }
  },
  savedConfigurations: []
};

function App() {
  const [data, setData] = useState(() => {
    // Try to load from localStorage
    const savedData = localStorage.getItem('qualityReorgData');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [saveDialog, setSaveDialog] = useState({
    open: false,
    configName: ''
  });

  const [loadDialog, setLoadDialog] = useState({
    open: false,
    selectedConfig: null
  });

  const [helpDialog, setHelpDialog] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('qualityReorgData', JSON.stringify(data));
  }, [data]);

  const handlePhaseChange = (event, newPhase) => {
    setData({
      ...data,
      currentPhase: newPhase
    });
    setSnackbar({
      open: true,
      message: `Switched to ${newPhase === 'current' ? 'Current' : 'Future'} State`,
      severity: 'info'
    });
  };

  const handleFactoryChange = (event, newFactory) => {
    setData({
      ...data,
      focusFactory: newFactory
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Handle different drag scenarios
    if (source.droppableId === 'roles-list' && destination.droppableId.startsWith('org-node-')) {
      // Dragging a role from the left panel to the org chart
      const nodeId = destination.droppableId.split('org-node-')[1];
      const phase = data.currentPhase;
      const factory = data.focusFactory;
      
      // Find the node in the org chart
      const updatedOrgChart = {...data.orgChart};
      const nodeIndex = updatedOrgChart[phase][factory].nodes.findIndex(node => node.id === nodeId);
      
      if (nodeIndex !== -1) {
        // Add the role to the node if it's not already there
        if (!updatedOrgChart[phase][factory].nodes[nodeIndex].roles.includes(draggableId)) {
          updatedOrgChart[phase][factory].nodes[nodeIndex].roles.push(draggableId);
          
          setData({
            ...data,
            orgChart: updatedOrgChart
          });
          
          setSnackbar({
            open: true,
            message: `Role assigned to organization node`,
            severity: 'success'
          });
        }
      }
    } else if (source.droppableId === 'personnel-list' && destination.droppableId.startsWith('role-')) {
      // Dragging a person from the right panel to a role in the org chart
      const roleId = destination.droppableId.split('role-')[1];
      const phase = data.currentPhase;
      const factory = data.focusFactory;
      
      // Update the assignments
      const updatedAssignments = {...data.assignments};
      updatedAssignments[phase][factory][roleId] = draggableId;
      
      setData({
        ...data,
        assignments: updatedAssignments
      });
      
      setSnackbar({
        open: true,
        message: `Personnel assigned to role`,
        severity: 'success'
      });
    } else if (source.droppableId.startsWith('org-node-') && destination.droppableId.startsWith('org-node-')) {
      // Reordering roles within the org chart or moving between nodes
      const sourceNodeId = source.droppableId.split('org-node-')[1];
      const destNodeId = destination.droppableId.split('org-node-')[1];
      const phase = data.currentPhase;
      const factory = data.focusFactory;
      
      // Find the nodes in the org chart
      const updatedOrgChart = {...data.orgChart};
      const sourceNodeIndex = updatedOrgChart[phase][factory].nodes.findIndex(node => node.id === sourceNodeId);
      const destNodeIndex = updatedOrgChart[phase][factory].nodes.findIndex(node => node.id === destNodeId);
      
      if (sourceNodeIndex !== -1 && destNodeIndex !== -1) {
        const sourceRoles = [...updatedOrgChart[phase][factory].nodes[sourceNodeIndex].roles];
        const destRoles = [...updatedOrgChart[phase][factory].nodes[destNodeIndex].roles];
        
        const [movedRole] = sourceRoles.splice(source.index, 1);
        destRoles.splice(destination.index, 0, movedRole);
        
        updatedOrgChart[phase][factory].nodes[sourceNodeIndex].roles = sourceRoles;
        updatedOrgChart[phase][factory].nodes[destNodeIndex].roles = destRoles;
        
        setData({
          ...data,
          orgChart: updatedOrgChart
        });
        
        setSnackbar({
          open: true,
          message: `Role moved to different node`,
          severity: 'success'
        });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `quality-reorg-${data.currentPhase}-${data.focusFactory}-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setSnackbar({
      open: true,
      message: 'Configuration exported successfully',
      severity: 'success'
    });
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setData(importedData);
        setSnackbar({
          open: true,
          message: 'Configuration imported successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error importing configuration: Invalid format',
          severity: 'error'
        });
      }
    };
    reader.readAsText(file);
  };

  // Add a role
  const handleAddRole = (newRole) => {
    setData({
      ...data,
      roles: {
        ...data.roles,
        [newRole.id]: newRole
      }
    });
    
    setSnackbar({
      open: true,
      message: `Role "${newRole.title}" added successfully`,
      severity: 'success'
    });
  };

  // Delete a role
  const handleDeleteRole = (roleId) => {
    const updatedRoles = {...data.roles};
    delete updatedRoles[roleId];
    
    // Also remove the role from any org chart nodes
    const updatedOrgChart = {...data.orgChart};
    Object.keys(updatedOrgChart).forEach(phase => {
      Object.keys(updatedOrgChart[phase]).forEach(factory => {
        updatedOrgChart[phase][factory].nodes.forEach(node => {
          node.roles = node.roles.filter(id => id !== roleId);
        });
      });
    });
    
    // And remove any assignments for this role
    const updatedAssignments = {...data.assignments};
    Object.keys(updatedAssignments).forEach(phase => {
      Object.keys(updatedAssignments[phase]).forEach(factory => {
        if (updatedAssignments[phase][factory][roleId]) {
          delete updatedAssignments[phase][factory][roleId];
        }
      });
    });
    
    setData({
      ...data,
      roles: updatedRoles,
      orgChart: updatedOrgChart,
      assignments: updatedAssignments
    });
    
    setSnackbar({
      open: true,
      message: 'Role deleted successfully',
      severity: 'success'
    });
  };

  // Add personnel
  const handleAddPersonnel = (newPerson) => {
    setData({
      ...data,
      personnel: {
        ...data.personnel,
        [newPerson.id]: newPerson
      }
    });
    
    setSnackbar({
      open: true,
      message: `Personnel "${newPerson.name}" added successfully`,
      severity: 'success'
    });
  };

  // Delete personnel
  const handleDeletePersonnel = (personId) => {
    const updatedPersonnel = {...data.personnel};
    delete updatedPersonnel[personId];
    
    // Also remove any assignments for this person
    const updatedAssignments = {...data.assignments};
    Object.keys(updatedAssignments).forEach(phase => {
      Object.keys(updatedAssignments[phase]).forEach(factory => {
        Object.keys(updatedAssignments[phase][factory]).forEach(roleId => {
          if (updatedAssignments[phase][factory][roleId] === personId) {
            delete updatedAssignments[phase][factory][roleId];
          }
        });
      });
    });
    
    setData({
      ...data,
      personnel: updatedPersonnel,
      assignments: updatedAssignments
    });
    
    setSnackbar({
      open: true,
      message: 'Personnel deleted successfully',
      severity: 'success'
    });
  };

  // Update org chart
  const handleUpdateOrgChart = (updatedChart) => {
    const phase = data.currentPhase;
    const factory = data.focusFactory;
    
    const newOrgChart = {...data.orgChart};
    newOrgChart[phase][factory] = updatedChart;
    
    setData({
      ...data,
      orgChart: newOrgChart
    });
  };

  // Menu handlers
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Save configuration dialog
  const handleOpenSaveDialog = () => {
    setSaveDialog({
      open: true,
      configName: `${data.currentPhase}-${data.focusFactory}-${new Date().toLocaleDateString()}`
    });
    handleMenuClose();
  };

  const handleCloseSaveDialog = () => {
    setSaveDialog({
      ...saveDialog,
      open: false
    });
  };

  const handleSaveConfiguration = () => {
    const newConfig = {
      id: Date.now().toString(),
      name: saveDialog.configName,
      date: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data))
    };
    
    const updatedConfigs = [...data.savedConfigurations, newConfig];
    
    setData({
      ...data,
      savedConfigurations: updatedConfigs
    });
    
    setSnackbar({
      open: true,
      message: `Configuration "${saveDialog.configName}" saved successfully`,
      severity: 'success'
    });
    
    handleCloseSaveDialog();
  };

  // Load configuration dialog
  const handleOpenLoadDialog = () => {
    setLoadDialog({
      open: true,
      selectedConfig: null
    });
    handleMenuClose();
  };

  const handleCloseLoadDialog = () => {
    setLoadDialog({
      ...loadDialog,
      open: false
    });
  };

  const handleLoadConfiguration = () => {
    if (loadDialog.selectedConfig) {
      const configToLoad = data.savedConfigurations.find(
        config => config.id === loadDialog.selectedConfig
      );
      
      if (configToLoad) {
        // Preserve the saved configurations list when loading
        const savedConfigs = [...data.savedConfigurations];
        setData({
          ...configToLoad.data,
          savedConfigurations: savedConfigs
        });
        
        setSnackbar({
          open: true,
          message: `Configuration "${configToLoad.name}" loaded successfully`,
          severity: 'success'
        });
      }
    }
    
    handleCloseLoadDialog();
  };

  // Delete saved configuration
  const handleDeleteSavedConfig = (configId) => {
    const updatedConfigs = data.savedConfigurations.filter(
      config => config.id !== configId
    );
    
    setData({
      ...data,
      savedConfigurations: updatedConfigs
    });
    
    setSnackbar({
      open: true,
      message: 'Saved configuration deleted',
      severity: 'info'
    });
  };

  // Reset to initial data
  const handleResetData = () => {
    // Preserve saved configurations
    const savedConfigs = [...data.savedConfigurations];
    setData({
      ...initialData,
      savedConfigurations: savedConfigs
    });
    
    setSnackbar({
      open: true,
      message: 'Reset to initial configuration',
      severity: 'info'
    });
    
    handleMenuClose();
  };

  // Help dialog
  const handleOpenHelpDialog = () => {
    setHelpDialog(true);
    handleMenuClose();
  };

  const handleCloseHelpDialog = () => {
    setHelpDialog(false);
  };

  // Copy current state to future state
  const handleCopyCurrentToFuture = () => {
    const factory = data.focusFactory;
    const updatedOrgChart = {...data.orgChart};
    const updatedAssignments = {...data.assignments};
    
    // Deep copy current state to future state
    updatedOrgChart.future[factory] = JSON.parse(JSON.stringify(updatedOrgChart.current[factory]));
    updatedAssignments.future[factory] = JSON.parse(JSON.stringify(updatedAssignments.current[factory]));
    
    setData({
      ...data,
      orgChart: updatedOrgChart,
      assignments: updatedAssignments
    });
    
    setSnackbar({
      open: true,
      message: 'Current state copied to future state',
      severity: 'success'
    });
  };

  // Copy future state to current state
  const handleCopyFutureToCurrent = () => {
    const factory = data.focusFactory;
    const updatedOrgChart = {...data.orgChart};
    const updatedAssignments = {...data.assignments};
    
    // Deep copy future state to current state
    updatedOrgChart.current[factory] = JSON.parse(JSON.stringify(updatedOrgChart.future[factory]));
    updatedAssignments.current[factory] = JSON.parse(JSON.stringify(updatedAssignments.future[factory]));
    
    setData({
      ...data,
      orgChart: updatedOrgChart,
      assignments: updatedAssignments
    });
    
    setSnackbar({
      open: true,
      message: 'Future state copied to current state',
      severity: 'success'
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Quality Re-organization Tool
            </Typography>
            
            <Button 
              color="inherit" 
              startIcon={<SaveIcon />}
              onClick={handleOpenSaveDialog}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            
            <Button 
              color="inherit" 
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            
            <input
              accept=".json"
              id="import-button"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <label htmlFor="import-button">
              <Button 
                color="inherit" 
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mr: 1 }}
              >
                Import
              </Button>
            </label>
            
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              id="basic-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleOpenLoadDialog}>
                <ListItemIcon>
                  <RestoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Load Saved Configuration</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleResetData}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reset to Default</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleOpenHelpDialog}>
                <ListItemIcon>
                  <HelpOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Help</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        
        <div className="phase-controls">
          <Tabs value={data.currentPhase} onChange={handlePhaseChange}>
            <Tab value="current" label="Current State" />
            <Tab value="future" label="Future State" />
          </Tabs>
        </div>
        
        <div className="focus-factory-tabs">
          <Tabs value={data.focusFactory} onChange={handleFactoryChange} centered>
            <Tab value="ADD" label="ADD - Advanced Drug Delivery" />
            <Tab value="BBV" label="BBV - Bottles, Blisters, Vials" />
            <Tab value="SYN" label="SYN - Syringes & Sterilization" />
          </Tabs>
        </div>

        {/* Advanced Tools Section */}
        <Box sx={{ p: 2, bgcolor: '#f0f0f0', display: 'flex', justifyContent: 'center', gap: 2 }}>
          <StateComparisonTool 
            currentState={data.orgChart.current[data.focusFactory]}
            futureState={data.orgChart.future[data.focusFactory]}
            roles={data.roles}
            personnel={data.personnel}
            focusFactory={data.focusFactory}
            onCopyToCurrent={handleCopyFutureToCurrent}
            onCopyToFuture={handleCopyCurrentToFuture}
          />
          
          <ReportsAndAnalytics 
            currentState={data.orgChart.current[data.focusFactory]}
            futureState={data.orgChart.future[data.focusFactory]}
            roles={data.roles}
            personnel={data.personnel}
            assignments={data.assignments}
            focusFactory={data.focusFactory}
          />
        </Box>
        
        <EnhancedDragDropProvider onDragEnd={handleDragEnd}>
          <div className="main-content">
            <LeftPanel 
              roles={data.roles} 
              className="panel left-panel"
              onAddRole={handleAddRole}
              onDeleteRole={handleDeleteRole}
            />
            <CenterPanel 
              orgChart={data.orgChart[data.currentPhase][data.focusFactory]} 
              roles={data.roles}
              personnel={data.personnel}
              assignments={data.assignments[data.currentPhase][data.focusFactory]}
              className="panel center-panel"
              onUpdateOrgChart={handleUpdateOrgChart}
            />
            <RightPanel 
              personnel={data.personnel} 
              className="panel right-panel"
              onAddPersonnel={handleAddPersonnel}
              onDeletePersonnel={handleDeletePersonnel}
            />
          </div>
        </EnhancedDragDropProvider>
        
        <div className="footer">
          <Typography variant="body2" color="textSecondary">
            Quality Re-organization Tool | {data.currentPhase === 'current' ? 'Current' : 'Future'} State | {data.focusFactory} Focus Factory
          </Typography>
        </div>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        {/* Save Configuration Dialog */}
        <Dialog open={saveDialog.open} onClose={handleCloseSaveDialog}>
          <DialogTitle>Save Configuration</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a name for this configuration to save it for future use.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Configuration Name"
              fullWidth
              variant="outlined"
              value={saveDialog.configName}
              onChange={(e) => setSaveDialog({...saveDialog, configName: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSaveDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveConfiguration} 
              variant="contained"
              disabled={!saveDialog.configName.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Load Configuration Dialog */}
        <Dialog 
          open={loadDialog.open} 
          onClose={handleCloseLoadDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Load Saved Configuration</DialogTitle>
          <DialogContent>
            {data.savedConfigurations.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {data.savedConfigurations.map((config) => (
                  <Box 
                    key={config.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: loadDialog.selectedConfig === config.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => setLoadDialog({...loadDialog, selectedConfig: config.id})}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {config.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(config.date).toLocaleString()}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavedConfig(config.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                No saved configurations found.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLoadDialog}>Cancel</Button>
            <Button 
              onClick={handleLoadConfiguration} 
              variant="contained"
              disabled={!loadDialog.selectedConfig || data.savedConfigurations.length === 0}
            >
              Load
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Help Dialog */}
        <Dialog
          open={helpDialog}
          onClose={handleCloseHelpDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Quality Re-organization Tool Help</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>Getting Started</Typography>
            <Typography paragraph>
              This tool helps you organize quality operations through re-organization and focus factory management.
            </Typography>
            
            <Typography variant="h6" gutterBottom>Key Features</Typography>
            <Typography variant="subtitle1">Phase Management</Typography>
            <Typography paragraph>
              Switch between Current State and Future State using the tabs at the top of the application.
            </Typography>
            
            <Typography variant="subtitle1">Focus Factory Selection</Typography>
            <Typography paragraph>
              Select the desired focus factory (ADD, BBV, or SYN) using the tabs below the phase selection.
            </Typography>
            
            <Typography variant="subtitle1">Working with Roles</Typography>
            <Typography paragraph>
              - View roles in the left panel<br />
              - Add new roles using the "Add Role" button<br />
              - Delete roles using the delete icon<br />
              - Drag roles from the left panel to nodes in the org chart
            </Typography>
            
            <Typography variant="subtitle1">Working with the Org Chart</Typography>
            <Typography paragraph>
              - Add new nodes using the "Add Node" buttons<br />
              - Remove nodes using the X icon<br />
              - Drag roles between nodes to reorganize<br />
              - Use zoom controls to adjust the view
            </Typography>
            
            <Typography variant="subtitle1">Assigning Personnel</Typography>
            <Typography paragraph>
              - View personnel in the right panel<br />
              - Add new personnel using the "Add Person" button<br />
              - Delete personnel using the delete icon<br />
              - Drag personnel from the right panel to roles in the org chart
            </Typography>
            
            <Typography variant="subtitle1">Advanced Tools</Typography>
            <Typography paragraph>
              - Use the "Compare States" tool to compare current and future states<br />
              - Use the "Reports & Analytics" tool to generate statistics and reports<br />
              - Copy configurations between current and future states
            </Typography>
            
            <Typography variant="subtitle1">Saving and Loading Data</Typography>
            <Typography paragraph>
              - Data is automatically saved to your browser's local storage<br />
              - Use the "Save" button to save named configurations<br />
              - Use the "Load" option in the menu to load saved configurations<br />
              - Use "Export" to save your configuration as a JSON file<br />
              - Use "Import" to load a previously exported configuration
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHelpDialog} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
