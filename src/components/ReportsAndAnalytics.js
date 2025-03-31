import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';

// Component for generating reports and analytics
const ReportsAndAnalytics = ({ 
  currentState, 
  futureState, 
  roles, 
  personnel, 
  assignments,
  focusFactory
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    // Current state stats
    const currentNodes = currentState.nodes;
    const currentRoles = currentNodes.flatMap(node => node.roles);
    const currentAssignments = Object.keys(assignments.current[focusFactory]).length;
    
    // Future state stats
    const futureNodes = futureState.nodes;
    const futureRoles = futureNodes.flatMap(node => node.roles);
    const futureAssignments = Object.keys(assignments.future[focusFactory]).length;
    
    // Role distribution by level
    const currentRolesByLevel = {};
    const futureRolesByLevel = {};
    
    currentNodes.forEach(node => {
      if (!currentRolesByLevel[node.level]) {
        currentRolesByLevel[node.level] = 0;
      }
      currentRolesByLevel[node.level] += node.roles.length;
    });
    
    futureNodes.forEach(node => {
      if (!futureRolesByLevel[node.level]) {
        futureRolesByLevel[node.level] = 0;
      }
      futureRolesByLevel[node.level] += node.roles.length;
    });
    
    return {
      current: {
        nodeCount: currentNodes.length,
        roleCount: currentRoles.length,
        assignmentCount: currentAssignments,
        rolesByLevel: currentRolesByLevel
      },
      future: {
        nodeCount: futureNodes.length,
        roleCount: futureRoles.length,
        assignmentCount: futureAssignments,
        rolesByLevel: futureRolesByLevel
      },
      totalRoles: Object.keys(roles).length,
      totalPersonnel: Object.keys(personnel).length
    };
  };

  // Generate a detailed report
  const generateDetailedReport = () => {
    const stats = calculateSummaryStats();
    
    let report = `
Quality Re-organization Tool - Detailed Report
Focus Factory: ${focusFactory}
Date: ${new Date().toLocaleString()}

SUMMARY STATISTICS
-----------------
Total Roles Available: ${stats.totalRoles}
Total Personnel Available: ${stats.totalPersonnel}

Current State:
- Nodes: ${stats.current.nodeCount}
- Role Assignments: ${stats.current.roleCount}
- Personnel Assignments: ${stats.current.assignmentCount}

Future State:
- Nodes: ${stats.future.nodeCount}
- Role Assignments: ${stats.future.roleCount}
- Personnel Assignments: ${stats.future.assignmentCount}

ROLE DISTRIBUTION BY LEVEL
-------------------------
Current State:
${Object.entries(stats.current.rolesByLevel).map(([level, count]) => 
  `Level ${parseInt(level) + 1}: ${count} roles`
).join('\n')}

Future State:
${Object.entries(stats.future.rolesByLevel).map(([level, count]) => 
  `Level ${parseInt(level) + 1}: ${count} roles`
).join('\n')}

DETAILED ROLE ASSIGNMENTS
------------------------
Current State:
${currentState.nodes.map(node => {
  const nodeRoles = node.roles.map(roleId => {
    const role = roles[roleId];
    const assignedPersonId = assignments.current[focusFactory][roleId];
    const assignedPerson = assignedPersonId ? personnel[assignedPersonId] : null;
    
    return `  - ${role ? role.title : 'Unknown Role'}${assignedPerson ? ` (Assigned: ${assignedPerson.name})` : ' (Unassigned)'}`;
  }).join('\n');
  
  return `Level ${node.level + 1}:\n${nodeRoles || '  No roles assigned'}`;
}).join('\n\n')}

Future State:
${futureState.nodes.map(node => {
  const nodeRoles = node.roles.map(roleId => {
    const role = roles[roleId];
    const assignedPersonId = assignments.future[focusFactory][roleId];
    const assignedPerson = assignedPersonId ? personnel[assignedPersonId] : null;
    
    return `  - ${role ? role.title : 'Unknown Role'}${assignedPerson ? ` (Assigned: ${assignedPerson.name})` : ' (Unassigned)'}`;
  }).join('\n');
  
  return `Level ${node.level + 1}:\n${nodeRoles || '  No roles assigned'}`;
}).join('\n\n')}

UNASSIGNED ROLES
---------------
${Object.values(roles).filter(role => 
  !currentState.nodes.some(node => node.roles.includes(role.id)) &&
  !futureState.nodes.some(node => node.roles.includes(role.id))
).map(role => `- ${role.title}`).join('\n') || 'All roles are assigned'}

UNASSIGNED PERSONNEL
------------------
${Object.values(personnel).filter(person => 
  !Object.values(assignments.current[focusFactory]).includes(person.id) &&
  !Object.values(assignments.future[focusFactory]).includes(person.id)
).map(person => `- ${person.name}`).join('\n') || 'All personnel are assigned'}
`;
    
    return report;
  };

  // Export the detailed report
  const handleExportReport = () => {
    const report = generateDetailedReport();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `detailed-report-${focusFactory}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  // Render the summary tab
  const renderSummaryTab = () => {
    const stats = calculateSummaryStats();
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              bgcolor: '#f5f8ff'
            }}
          >
            <Typography variant="h6" gutterBottom>Current State</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <TableChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Organization Nodes" 
                  secondary={stats.current.nodeCount} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Role Assignments" 
                  secondary={stats.current.roleCount} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PieChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Personnel Assignments" 
                  secondary={stats.current.assignmentCount} 
                />
              </ListItem>
            </List>
            
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Role Distribution by Level:
            </Typography>
            
            {Object.entries(stats.current.rolesByLevel).map(([level, count]) => (
              <Box 
                key={level} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mt: 1 
                }}
              >
                <Typography variant="body2" sx={{ width: 80 }}>
                  Level {parseInt(level) + 1}:
                </Typography>
                <Box 
                  sx={{ 
                    height: 20, 
                    bgcolor: 'primary.main', 
                    borderRadius: 1,
                    width: `${Math.min(count * 20, 200)}px`
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {count} roles
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: '100%', 
              bgcolor: '#fff8f5'
            }}
          >
            <Typography variant="h6" gutterBottom>Future State</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <TableChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Organization Nodes" 
                  secondary={stats.future.nodeCount} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Role Assignments" 
                  secondary={stats.future.roleCount} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PieChartIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Personnel Assignments" 
                  secondary={stats.future.assignmentCount} 
                />
              </ListItem>
            </List>
            
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Role Distribution by Level:
            </Typography>
            
            {Object.entries(stats.future.rolesByLevel).map(([level, count]) => (
              <Box 
                key={level} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mt: 1 
                }}
              >
                <Typography variant="body2" sx={{ width: 80 }}>
                  Level {parseInt(level) + 1}:
                </Typography>
                <Box 
                  sx={{ 
                    height: 20, 
                    bgcolor: 'secondary.main', 
                    borderRadius: 1,
                    width: `${Math.min(count * 20, 200)}px`
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {count} roles
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mt: 2
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Overall Statistics</Typography>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={handleExportReport}
                size="small"
              >
                Export Detailed Report
              </Button>
            </Box>
            <Divider sx={{ my: 1 }} />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={3}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <Typography variant="h4">{stats.totalRoles}</Typography>
                  <Typography variant="body2">Total Roles</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={3}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <Typography variant="h4">{stats.totalPersonnel}</Typography>
                  <Typography variant="body2">Total Personnel</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={3}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <Typography variant="h4">
                    {stats.future.nodeCount - stats.current.nodeCount}
                  </Typography>
                  <Typography variant="body2">Node Change</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={3}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <Typography variant="h4">
                    {stats.future.roleCount - stats.current.roleCount}
                  </Typography>
                  <Typography variant="body2">Role Assignment Change</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Button 
        variant="outlined" 
        startIcon={<BarChartIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Reports & Analytics
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Reports & Analytics - {focusFactory}</DialogTitle>
        <DialogContent>
          {renderSummaryTab()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportReport} startIcon={<DownloadIcon />}>
            Export Detailed Report
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportsAndAnalytics;
