import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Chip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const PhaseComparison = ({ factory }) => {
  const dispatch = useDispatch();
  const currentOrgChart = useSelector(state => 
    state.orgChart.orgCharts.current[factory] || { nodes: [], connections: [] }
  );
  const futureOrgChart = useSelector(state => 
    state.orgChart.orgCharts.future[factory] || { nodes: [], connections: [] }
  );
  
  // Calculate differences between current and future states
  const calculateDifferences = () => {
    const currentNodeIds = currentOrgChart.nodes.map(node => node.id);
    const futureNodeIds = futureOrgChart.nodes.map(node => node.id);
    
    // Added roles (in future but not in current)
    const addedRoles = futureOrgChart.nodes.filter(node => 
      !currentNodeIds.includes(node.id)
    ).length;
    
    // Removed roles (in current but not in future)
    const removedRoles = currentOrgChart.nodes.filter(node => 
      !futureNodeIds.includes(node.id)
    ).length;
    
    // Changed assignments (same role ID but different person)
    let reassignments = 0;
    futureOrgChart.nodes.forEach(futureNode => {
      const currentNode = currentOrgChart.nodes.find(node => node.id === futureNode.id);
      if (currentNode && currentNode.personId !== futureNode.personId) {
        reassignments++;
      }
    });
    
    // Changed reporting relationships
    let changedRelationships = 0;
    futureOrgChart.nodes.forEach(futureNode => {
      const currentNode = currentOrgChart.nodes.find(node => node.id === futureNode.id);
      if (currentNode && currentNode.parentId !== futureNode.parentId) {
        changedRelationships++;
      }
    });
    
    return {
      addedRoles,
      removedRoles,
      reassignments,
      changedRelationships
    };
  };
  
  const differences = calculateDifferences();
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CompareArrowsIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Phase Comparison</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Current State</Typography>
          <Typography variant="body2">
            {currentOrgChart.nodes.length} roles defined
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>Future State</Typography>
          <Typography variant="body2">
            {futureOrgChart.nodes.length} roles defined
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>Changes Summary:</Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          label={`+${differences.addedRoles} roles added`} 
          color="success" 
          size="small" 
          variant="outlined"
        />
        <Chip 
          label={`-${differences.removedRoles} roles removed`} 
          color="error" 
          size="small" 
          variant="outlined"
        />
        <Chip 
          label={`${differences.reassignments} reassignments`} 
          color="primary" 
          size="small" 
          variant="outlined"
        />
        <Chip 
          label={`${differences.changedRelationships} reporting changes`} 
          color="warning" 
          size="small" 
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

export default PhaseComparison;
