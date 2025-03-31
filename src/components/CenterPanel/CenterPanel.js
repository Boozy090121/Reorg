import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OrgChartNode from './OrgChartNode';
import OrgChartConnection from './OrgChartConnection';
import DroppableOrgChart from '../DragDrop/DroppableOrgChart';

const CenterPanel = ({ phase, factory }) => {
  const dispatch = useDispatch();
  const orgChart = useSelector(state => 
    state.orgChart.orgCharts[phase]?.[factory] || { nodes: [], connections: [] }
  );
  
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle reset view
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle fit to screen
  const handleFit = () => {
    // This would be implemented with actual chart dimensions
    setZoom(0.8);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle mouse down for panning
  const handleMouseDown = (e) => {
    if (e.target.closest('.org-chart-node')) {
      // Don't start panning if clicking on a node
      return;
    }
    
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse move for panning
  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  // Handle node selection
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };
  
  // Add event listeners for mouse up and mouse leave
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  return (
    <Paper 
      sx={{ 
        height: '100%', 
        overflow: 'hidden', 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        cursor: dragging ? 'grabbing' : 'default'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Organization Chart
        </Typography>
        
        <ButtonGroup size="small">
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton onClick={handleReset}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit to Screen">
            <IconButton onClick={handleFit}>
              <FitScreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Box>
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          overflow: 'hidden',
          border: '1px solid #eee',
          borderRadius: 1,
          backgroundColor: '#fafafa'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {orgChart.nodes.length > 0 ? (
          <DroppableOrgChart 
            phase={phase} 
            factory={factory} 
            zoom={zoom} 
            position={position} 
            dragging={dragging} 
            selectedNode={selectedNode} 
            onNodeSelect={handleNodeSelect}
          />
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography color="text.secondary">
              No organization chart data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag roles from the left panel to build your organization chart
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CenterPanel;
