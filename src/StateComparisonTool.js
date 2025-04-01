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
  Tooltip
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Component for comparing current and future states
const StateComparisonTool = ({ 
  currentState, 
  futureState, 
  roles, 
  personnel, 
  focusFactory,
  onCopyToCurrent,
  onCopyToFuture
}) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [comparisonReport, setComparisonReport] = useState('');

  const handleOpen = () => {
    setOpen(true);
    generateComparisonReport();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Generate a comparison report between current and future states
  const generateComparisonReport = () => {
    const currentNodes = currentState.nodes;
    const futureNodes = futureState.nodes;
    
    let report = '';
    
    // Compare node count
    report += `Current state has ${currentNodes.length} nodes.\n`;
    report += `Future state has ${futureNodes.length} nodes.\n\n`;
    
    // Compare roles assigned
    const currentRoles = currentNodes.flatMap(node => node.roles);
    const futureRoles = futureNodes.flatMap(node => node.roles);
    
    const currentRoleCount = currentRoles.length;
    const futureRoleCount = futureRoles.length;
    
    report += `Current state has ${currentRoleCount} role assignments.\n`;
    report += `Future state has ${futureRoleCount} role assignments.\n\n`;
    
    // Find roles in future but not in current
    const newRoles = futureRoles.filter(roleId => !currentRoles.includes(roleId));
    if (newRoles.length > 0) {
      report += 'New roles in future state:\n';
      newRoles.forEach(roleId => {
        if (roles[roleId]) {
          report += `- ${roles[roleId].title}\n`;
        }
      });
      report += '\n';
    }
    
    // Find roles in current but not in future
    const removedRoles = currentRoles.filter(roleId => !futureRoles.includes(roleId));
    if (removedRoles.length > 0) {
      report += 'Roles removed in future state:\n';
      removedRoles.forEach(roleId => {
        if (roles[roleId]) {
          report += `- ${roles[roleId].title}\n`;
        }
      });
      report += '\n';
    }
    
    setComparisonReport(report);
  };

  // Copy current state to future state
  const handleCopyCurrentToFuture = () => {
    onCopyToFuture();
    setOpen(false);
  };

  // Copy future state to current state
  const handleCopyFutureToCurrent = () => {
    onCopyToCurrent();
    setOpen(false);
  };

  // Export comparison report
  const handleExportReport = () => {
    const reportText = `
Quality Re-organization Tool - State Comparison Report
Focus Factory: ${focusFactory}
Date: ${new Date().toLocaleString()}

${comparisonReport}

Notes:
${notes}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison-report-${focusFactory}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  return (
    <>
      <Button 
        variant="outlined" 
        startIcon={<CompareArrowsIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Compare States
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>State Comparison Tool - {focusFactory}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '300px', 
                  overflow: 'auto',
                  bgcolor: '#f5f8ff'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Current State</Typography>
                  <Tooltip title="Copy to Future State">
                    <IconButton onClick={handleCopyCurrentToFuture} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" gutterBottom>
                  Nodes: {currentState.nodes.length}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  Roles Assigned: {currentState.nodes.flatMap(node => node.roles).length}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Organization Structure:
                </Typography>
                
                {currentState.nodes.map((node, index) => (
                  <Box key={index} sx={{ ml: node.level * 2, mt: 1 }}>
                    <Typography variant="body2">
                      Level {node.level + 1}: {node.roles.length} roles
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
                  height: '300px', 
                  overflow: 'auto',
                  bgcolor: '#fff8f5'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Future State</Typography>
                  <Tooltip title="Copy to Current State">
                    <IconButton onClick={handleCopyFutureToCurrent} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" gutterBottom>
                  Nodes: {futureState.nodes.length}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  Roles Assigned: {futureState.nodes.flatMap(node => node.roles).length}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Organization Structure:
                </Typography>
                
                {futureState.nodes.map((node, index) => (
                  <Box key={index} sx={{ ml: node.level * 2, mt: 1 }}>
                    <Typography variant="body2">
                      Level {node.level + 1}: {node.roles.length} roles
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
                  mt: 2, 
                  height: '200px', 
                  overflow: 'auto',
                  bgcolor: '#f5f5f5'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Comparison Report</Typography>
                  <Tooltip title="View Full Report">
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography 
                  variant="body2" 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}
                >
                  {comparisonReport}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportReport}>Export Report</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StateComparisonTool;
