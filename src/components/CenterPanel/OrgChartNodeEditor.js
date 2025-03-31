import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { updateNode } from '../../features/orgChartSlice';

const OrgChartNodeEditor = ({ node, open, onClose, phase, factory }) => {
  const dispatch = useDispatch();
  const [nodeData, setNodeData] = React.useState({
    title: '',
    position: { x: 0, y: 0 }
  });
  
  // Initialize form data when node changes
  React.useEffect(() => {
    if (node) {
      setNodeData({
        title: node.title,
        position: { ...node.position }
      });
    }
  }, [node]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNodeData({
      ...nodeData,
      [name]: value
    });
  };
  
  const handlePositionChange = (axis, value) => {
    setNodeData({
      ...nodeData,
      position: {
        ...nodeData.position,
        [axis]: parseInt(value, 10) || 0
      }
    });
  };
  
  const handleSubmit = () => {
    if (!node) return;
    
    // Dispatch action to update the node
    dispatch(updateNode({
      phase,
      factory,
      nodeId: node.id,
      updatedNode: {
        title: nodeData.title,
        position: nodeData.position
      }
    }));
    
    onClose();
  };
  
  if (!node) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Node</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={nodeData.title}
            onChange={handleInputChange}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="X Position"
              type="number"
              value={nodeData.position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              fullWidth
            />
            <TextField
              label="Y Position"
              type="number"
              value={nodeData.position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrgChartNodeEditor;
