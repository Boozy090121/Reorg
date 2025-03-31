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

import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';

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
      ADD: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
          { id: 'node-3', level: 1, roles: [] },
          { id: 'node-4', level: 2, roles: [] },
          { id: 'node-5', level: 2, roles: [] },
        ]
      },
      BBV: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
          { id: 'node-3', level: 1, roles: [] },
        ]
      },
      SYN: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
          { id: 'node-3', level: 1, roles: [] },
        ]
      }
    },
    future: {
      ADD: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
          { id: 'node-3', level: 1, roles: [] },
        ]
      },
      BBV: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
        ]
      },
      SYN: {
        nodes: [
          { id: 'node-1', level: 0, roles: [] },
          { id: 'node-2', level: 1, roles: [] },
        ]
      }
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
  }
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
    if (source.droppableId.startsWith('roles-list') && destination.droppableId.startsWith('org-node')) {
      // Dragging a role from the left panel to the org chart
      const nodeId = destination.droppableId.split('-').pop();
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
    } else if (source.droppableId.startsWith('personnel-list') && destination.droppableId.startsWith('role-')) {
      // Dragging a person from the right panel to a role in the org chart
      const roleId = destination.droppableId.split('-').pop();
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
    } else if (source.droppableId.startsWith('org-node') && destination.droppableId.startsWith('org-node')) {
      // Reordering roles within the org chart or moving between nodes
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same node
        const nodeId = source.droppableId.split('-').pop();
        const phase = data.currentPhase;
        const factory = data.focusFactory;
        
        // Find the node in the org chart
        const updatedOrgChart = {...data.orgChart};
        const nodeIndex = updatedOrgChart[phase][factory].nodes.findIndex(node => node.id === nodeId);
        
        if (nodeIndex !== -1) {
          const roles = [...updatedOrgChart[phase][factory].nodes[nodeIndex].roles];
          const [movedRole] = roles.splice(source.index, 1);
          roles.splice(destination.index, 0, movedRole);
          
          updatedOrgChart[phase][factory].nodes[nodeIndex].roles = roles;
          
          setData({
            ...data,
            orgChart: updatedOrgChart
          });
        }
      } else {
        // Moving between nodes
        const sourceNodeId = source.droppableId.split('-').pop();
        const destNodeId = destination.droppableId.split('-').pop();
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Quality Re-organization Tool
            </Typography>
            <Button color="inherit" onClick={handleExport}>Export</Button>
            <input
              accept=".json"
              id="import-button"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <label htmlFor="import-button">
              <Button color="inherit" component="span">Import</Button>
            </label>
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
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="main-content">
            <LeftPanel 
              roles={data.roles} 
              className="panel left-panel" 
            />
            <CenterPanel 
              orgChart={data.orgChart[data.currentPhase][data.focusFactory]} 
              roles={data.roles}
              personnel={data.personnel}
              assignments={data.assignments[data.currentPhase][data.focusFactory]}
              className="panel center-panel" 
            />
            <RightPanel 
              personnel={data.personnel} 
              className="panel right-panel" 
            />
          </div>
        </DragDropContext>
        
        <div className="footer">
          <Typography variant="body2" color="textSecondary">
            Quality Re-organization Tool | {data.currentPhase === 'current' ? 'Current' : 'Future'} State | {data.focusFactory} Focus Factory
          </Typography>
        </div>
        
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
      </div>
    </ThemeProvider>
  );
}

export default App;
