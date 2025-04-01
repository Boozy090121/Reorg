import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

// Custom node types
const nodeTypes = {
  process: ProcessNode,
  task: TaskNode,
  decision: DecisionNode,
  start: StartNode,
  end: EndNode
};

// Redux slice for process flow (to be added to your existing slices)
const initialState = {
  nodes: [],
  edges: [],
  tasks: {}
};

// Process Flow Component
const QualityProcessFlow = () => {
  const dispatch = useDispatch();
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

  // Load initial data from redux
  // const processFlowData = useSelector(state => state.processFlow);

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
      type: newNodeType,
      position,
      data: { 
        label: `New ${newNodeType}`,
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

  const handleEditNode = () => {
    if (!selectedNode) return;
    setIsEditingNode(true);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    
    // Remove node
    setNodes(nodes.filter(n => n.id !== selectedNode.id));
    
    // Remove connected edges
    setEdges(edges.filter(e => 
      e.source !== selectedNode.id && e.target !== selectedNode.id
    ));
    
    setSelectedNode(null);
  };

  const handleAddTask = () => {
    if (!selectedNode) return;
    
    const taskId = `task-${Date.now()}`;
    const task = {
      ...newTask,
      id: taskId,
      nodeId: selectedNode.id,
      createdAt: new Date().toISOString()
    };
    
    // Update the node's tasks
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            tasks: [...node.data.tasks, taskId]
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    
    // Add task to redux store
    // dispatch(addTask({ taskId, task }));
    
    setIsAddingTask(false);
    setNewTask({ 
      title: '', 
      description: '', 
      assignedTo: [], 
      dueDate: '',
      status: 'pending'
    });
  };

  // UI Components for the panel
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Left Sidebar for Controls */}
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
          onClick={() => setIsAddingNode(true)}
          sx={{ mb: 2 }}
        >
          Add Node
        </Button>
        
        <Typography variant="subtitle2" gutterBottom>Node Types:</Typography>
        <List dense>
          <ListItem>
            <Chip 
              label="Process"
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Standard process step" />
          </ListItem>
          <ListItem>
            <Chip 
              label="Decision" 
              color="secondary"
              size="small"
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Decision point" />
          </ListItem>
          <ListItem>
            <Chip 
              label="Start/End" 
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
            <ListItemText primary="Process boundaries" />
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        {selectedNode && (
          <Box>
            <Typography variant="subtitle1">Selected Node:</Typography>
            <Card variant="outlined" sx={{ mb: 2, mt: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {selectedNode.data.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {selectedNode.type}
                </Typography>
                <Typography variant="body2">
                  {selectedNode.data.description || 'No description'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={handleEditNode}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDeleteNode}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => setIsAddingTask(true)}
                  sx={{ ml: 'auto' }}
                >
                  <AssignmentIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
            
            <Typography variant="subtitle2">Tasks:</Typography>
            {selectedNode.data.tasks && selectedNode.data.tasks.length > 0 ? (
              <List dense>
                {selectedNode.data.tasks.map(taskId => (
                  <ListItem 
                    key={taskId}
                    secondaryAction={
                      <IconButton edge="end" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={`Task #${taskId.split('-')[1]}`}
                      secondary="View task details"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No tasks assigned to this node
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      {/* Main Flow Canvas */}
      <Box sx={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>
      
      {/* Dialogs */}
      {/* Add Node Dialog */}
      <Dialog open={isAddingNode} onClose={() => setIsAddingNode(false)}>
        <DialogTitle>Add New Node</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            Select Node Type:
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <Button 
                variant={newNodeType === 'process' ? 'contained' : 'outlined'}
                color="primary"
                fullWidth
                onClick={() => setNewNodeType('process')}
              >
                Process
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button 
                variant={newNodeType === 'decision' ? 'contained' : 'outlined'}
                color="secondary"
                fullWidth
                onClick={() => setNewNodeType('decision')}
              >
                Decision
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button 
                variant={newNodeType === 'start' ? 'contained' : 'outlined'}
                color="success"
                fullWidth
                onClick={() => setNewNodeType('start')}
              >
                Start
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button 
                variant={newNodeType === 'end' ? 'contained' : 'outlined'}
                color="error"
                fullWidth
                onClick={() => setNewNodeType('end')}
              >
                End
              </Button>
            </Grid>
          </Grid>
          
          <TextField
            margin="dense"
            label="Node Label"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingNode(false)}>Cancel</Button>
          <Button onClick={handleAddNode} variant="contained">Add Node</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Node Dialog */}
      <Dialog open={isEditingNode} onClose={() => setIsEditingNode(false)}>
        <DialogTitle>Edit Node</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Node Label"
            fullWidth
            variant="outlined"
            value={selectedNode?.data.label || ''}
            onChange={(e) => {
              setNodes(nodes.map(node => {
                if (node.id === selectedNode.id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      label: e.target.value
                    }
                  };
                }
                return node;
              }));
            }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={selectedNode?.data.description || ''}
            onChange={(e) => {
              setNodes(nodes.map(node => {
                if (node.id === selectedNode.id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      description: e.target.value
                    }
                  };
                }
                return node;
              }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditingNode(false)}>Cancel</Button>
          <Button 
            onClick={() => setIsEditingNode(false)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog 
        open={isAddingTask} 
        onClose={() => setIsAddingTask(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Task to {selectedNode?.data.label}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
          
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
          />
          
          {/* Add more fields for task assignment, status, etc. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingTask(false)}>Cancel</Button>
          <Button 
            onClick={handleAddTask} 
            variant="contained"
            disabled={!newTask.title}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Custom node components
function ProcessNode({ data }) {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        minWidth: 150,
        textAlign: 'center'
      }}
    >
      <Typography fontWeight="bold">{data.label}</Typography>
      {data.description && (
        <Typography fontSize="0.8rem" color="text.secondary">
          {data.description}
        </Typography>
      )}
      {data.tasks?.length > 0 && (
        <Chip 
          size="small" 
          label={`${data.tasks.length} tasks`} 
          sx={{ mt: 1 }}
        />
      )}
    </Box>
  );
}

function DecisionNode({ data }) {
  return (
    <Box
      sx={{
        width: 150,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(45deg)',
        backgroundColor: '#f0f8ff',
        border: '1px solid #9cc',
        margin: 3
      }}
    >
      <Box sx={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
        <Typography fontWeight="bold">{data.label}</Typography>
        {data.tasks?.length > 0 && (
          <Chip 
            size="small" 
            label={`${data.tasks.length} tasks`} 
            sx={{ mt: 1 }}
          />
        )}
      </Box>
    </Box>
  );
}

function StartNode({ data }) {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: '50%',
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Typography fontWeight="bold">{data.label}</Typography>
    </Box>
  );
}

function EndNode({ data }) {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: '50%',
        backgroundColor: '#ffebee',
        border: '2px solid #f44336',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Typography fontWeight="bold">{data.label}</Typography>
    </Box>
  );
}

function TaskNode({ data }) {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: '#fff3e0',
        border: '1px solid #ffb74d',
        minWidth: 150,
        textAlign: 'left'
      }}
    >
      <Typography fontSize="0.9rem" fontWeight="bold">{data.label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
        <Chip 
          size="small" 
          label={data.status} 
          color={data.status === 'completed' ? 'success' : 'default'}
        />
        {data.assignedTo && (
          <Typography fontSize="0.7rem">
            Assigned: {data.assignedTo}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default QualityProcessFlow;