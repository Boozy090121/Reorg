import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
// CSS is now loaded from CDN in index.html
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Process Flow Component
const QualityProcessFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState('process');
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignedTo: [], 
    dueDate: '',
    status: 'pending'
  });

  // Event Handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    []
  );

  const handleAddNode = () => {
    const newId = `node-${nodes.length + 1}`;
    const position = { x: 250, y: 150 };
    
    const newNode = {
      id: newId,
      type: 'default', // Changed from newNodeType since we removed custom node types
      position,
      data: { 
        label: `New Node ${nodes.length + 1}`,
        description: '',
        tasks: []
      }
    };
    
    setNodes([...nodes, newNode]);
    setIsAddingNode(false);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    setNodes(nodes.filter(n => n.id !== selectedNode.id));
    setEdges(edges.filter(e => 
      e.source !== selectedNode.id && e.target !== selectedNode.id
    ));
    setSelectedNode(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box 
        component={Paper} 
        sx={{ 
          width: 250, 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <Typography variant="h6" gutterBottom>Process Flow Tools</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddNode}
          sx={{ mb: 2 }}
        >
          Add Node
        </Button>

        {selectedNode && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteNode}
            sx={{ mb: 2 }}
          >
            Delete Node
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default QualityProcessFlow;