import React, { useState } from 'react';
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

const CenterPanel = ({ orgChart, roles, personnel, assignments, className }) => {
  const [zoom, setZoom] = useState(100);
  
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
  
  return (
    <div className={className}>
      <Typography variant="h6" className="panel-title">
        Organization Chart
      </Typography>
      
      <div className="org-chart-wrapper">
        <div 
          className="org-chart-content"
          style={{ 
            transform: `scale(${zoom / 100})`,
            minHeight: Object.keys(nodesByLevel).length * 150 + 'px'
          }}
        >
          {Object.keys(nodesByLevel).sort((a, b) => a - b).map(level => (
            <div key={level} className="org-level">
              {nodesByLevel[level].map(node => (
                <OrgNode 
                  key={node.id} 
                  node={node} 
                  roles={roles} 
                  personnel={personnel}
                  assignments={assignments}
                />
              ))}
            </div>
          ))}
        </div>
        
        <div className="zoom-controls">
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          
          <Slider
            value={zoom}
            onChange={handleZoomChange}
            min={50}
            max={200}
            step={5}
            sx={{ width: 100, mx: 1 }}
            aria-label="Zoom"
          />
          
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Fit to Screen">
            <IconButton onClick={handleFitToScreen} size="small" sx={{ ml: 1 }}>
              <FitScreenIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      
      {Object.keys(nodesByLevel).length === 0 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="50vh"
        >
          <Typography variant="body1" color="text.secondary">
            No organization chart nodes available
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default CenterPanel;
