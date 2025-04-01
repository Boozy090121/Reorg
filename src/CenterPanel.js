import React, { useState, useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Slider, 
  IconButton,
  Tooltip
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import OrgNode from './OrgNode';
import OrgChartOptimizer from './OrgChartOptimizer';

const CenterPanel = ({ orgChart, roles, personnel, assignments, className, onUpdateOrgChart }) => {
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef(null);
  
  // Group nodes by level for hierarchical display
  const nodesByLevel = {};
  orgChart.nodes.forEach(node => {
    if (!nodesByLevel[node.level]) {
      nodesByLevel[node.level] = [];
    }
    nodesByLevel[node.level].push(node);
  });
  
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };
  
  const handleFitToScreen = () => {
    setZoom(100);
  };

  // Function to add a new node to the org chart
  const handleAddNode = (level) => {
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      level,
      roles: []
    };
    
    const updatedNodes = [...orgChart.nodes, newNode];
    onUpdateOrgChart({
      ...orgChart,
      nodes: updatedNodes
    });
  };

  // Function to remove a node from the org chart
  const handleRemoveNode = (nodeId) => {
    const updatedNodes = orgChart.nodes.filter(node => node.id !== nodeId);
    onUpdateOrgChart({
      ...orgChart,
      nodes: updatedNodes
    });
  };
  
  return (
    <div className={className} ref={containerRef}>
      <Typography variant="h6" className="panel-title">
        Organization Chart
      </Typography>
      
      <OrgChartOptimizer containerRef={containerRef}>
        <Box sx={{ padding: 2 }}>
          {Object.keys(nodesByLevel).sort((a, b) => a - b).map(level => (
            <Box key={level}>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1">Level {parseInt(level) + 1}</Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleAddNode(parseInt(level))}
                >
                  Add Node to Level {parseInt(level) + 1}
                </Button>
              </Box>
              
              <div className="org-level">
                {nodesByLevel[level].map(node => (
                  <OrgNode 
                    key={node.id} 
                    node={node} 
                    roles={roles} 
                    personnel={personnel}
                    assignments={assignments}
                    onRemoveNode={handleRemoveNode}
                  />
                ))}
              </div>
            </Box>
          ))}
          
          {/* Add new level button */}
          <Box 
            display="flex" 
            justifyContent="center" 
            mt={3}
          >
            <Button 
              variant="contained" 
              onClick={() => handleAddNode(Object.keys(nodesByLevel).length)}
            >
              Add New Level
            </Button>
          </Box>
        </Box>
      </OrgChartOptimizer>
      
      {Object.keys(nodesByLevel).length === 0 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="50vh"
        >
          <Button 
            variant="contained"
            onClick={() => handleAddNode(0)}
          >
            Create First Node
          </Button>
        </Box>
      )}
    </div>
  );
};

export default CenterPanel;
