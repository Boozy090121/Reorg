import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Zoom, 
  Avatar, 
  Chip, 
  Card, 
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PanToolIcon from '@mui/icons-material/PanTool';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// Main Org Chart Component
const ModernOrgChart = ({ orgChart, roles, personnel, assignments, onUpdateOrgChart }) => {
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  const dispatch = useDispatch();
  
  // Auto-fit calculation on mount and when container size changes
  useEffect(() => {
    const calculateOptimalZoom = () => {
      if (!containerRef.current || !chartRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const chartWidth = chartRef.current.scrollWidth;
      const chartHeight = chartRef.current.scrollHeight;
      
      // Calculate zoom factors for width and height
      const widthZoom = (containerWidth / chartWidth) * 90; // 90% to leave some margin
      const heightZoom = (containerHeight / chartHeight) * 90;
      
      // Use the smaller zoom factor to ensure everything fits
      const optimalZoom = Math.min(widthZoom, heightZoom, 100); // Cap at 100%
      
      setZoom(Math.max(optimalZoom, 50)); // Minimum zoom of 50%
      setPosition({ x: 0, y: 0 }); // Reset position
    };
    
    calculateOptimalZoom();
    
    // Set up resize observer to recalculate when container size changes
    const resizeObserver = new ResizeObserver(calculateOptimalZoom);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, orgChart]);
  
  // Handle zoom change
  const handleZoomChange = (newZoom) => {
    setZoom(Math.min(Math.max(newZoom, 50), 200));
  };
  
  // Zoom in/out functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };
  
  // Fit to screen function
  const handleFitToScreen = () => {
    if (!containerRef.current || !chartRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const chartWidth = chartRef.current.scrollWidth;
    const chartHeight = chartRef.current.scrollHeight;
    
    const widthZoom = (containerWidth / chartWidth) * 90;
    const heightZoom = (containerHeight / chartHeight) * 90;
    
    const optimalZoom = Math.min(widthZoom, heightZoom, 100);
    
    setZoom(Math.max(optimalZoom, 50));
    setPosition({ x: 0, y: 0 }); // Reset position
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    
    // Reset position when toggling fullscreen
    setPosition({ x: 0, y: 0 });
    
    // Recalculate optimal zoom after a short delay to allow DOM to update
    setTimeout(handleFitToScreen, 100);
  };
  
  // Pan functionality
  const handlePanStart = (e) => {
    if (!isPanning) return;
    
    if (e.type === 'mousedown') {
      setStartPan({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      
      const handleMouseMove = (moveEvent) => {
        setPosition({
          x: moveEvent.clientX - startPan.x,
          y: moveEvent.clientY - startPan.y
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  // Toggle pan mode
  const togglePanMode = () => {
    setIsPanning(prev => !prev);
  };
  
  // Handle node selection
  const handleNodeSelect = (node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
  };
  
  // Open context menu
  const handleContextMenu = (event, node) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            node: node
          }
        : null,
    );
  };
  
  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  
  // Function to add a new node
  const handleAddNode = (parentNode = null) => {
    const newNodeId = `${currentFactory.toLowerCase()}-node-${Date.now()}`;
    
    // Determine level based on parent
    let level = 0;
    let parentId = null;
    
    if (parentNode) {
      level = parentNode.level + 1;
      parentId = parentNode.id;
    }
    
    // Find a suitable position
    let posX = 400;
    let posY = 150 + (level * 200);
    
    if (parentNode) {
      posX = parentNode.position.x;
      posY = parentNode.position.y + 200;
    }
    
    const newNode = {
      id: newNodeId,
      title: `New Position`,
      level,
      parentId,
      personId: null,
      roles: [],
      position: { x: posX, y: posY }
    };
    
    const updatedNodes = [...orgChart.nodes, newNode];
    
    // If there's a parent, add a connection
    let updatedConnections = [...orgChart.connections];
    if (parentId) {
      updatedConnections.push({
        source: parentId,
        target: newNodeId
      });
    }
    
    onUpdateOrgChart({
      ...orgChart,
      nodes: updatedNodes,
      connections: updatedConnections
    });
    
    handleCloseContextMenu();
  };
  
  // Function to remove a node
  const handleRemoveNode = (nodeId) => {
    // Remove node
    const updatedNodes = orgChart.nodes.filter(node => node.id !== nodeId);
    
    // Remove connections involving this node
    const updatedConnections = orgChart.connections.filter(
      conn => conn.source !== nodeId && conn.target !== nodeId
    );
    
    onUpdateOrgChart({
      ...orgChart,
      nodes: updatedNodes,
      connections: updatedConnections
    });
    
    setSelectedNode(null);
    handleCloseContextMenu();
  };
  
  // Organize nodes by level for a hierarchical display
  const getNodesAndConnectionsByLevels = () => {
    const nodesByLevel = {};
    
    // Group nodes by level
    orgChart.nodes.forEach(node => {
      const level = node.level || 0;
      if (!nodesByLevel[level]) {
        nodesByLevel[level] = [];
      }
      nodesByLevel[level].push(node);
    });
    
    // Sort levels
    const sortedLevels = Object.keys(nodesByLevel).sort((a, b) => a - b);
    
    return {
      nodesByLevel,
      sortedLevels
    };
  };
  
  const { nodesByLevel, sortedLevels } = getNodesAndConnectionsByLevels();
  
  // Render node card
  const renderNodeCard = (node) => {
    const isSelected = node.id === selectedNode;
    const person = node.personId ? personnel[node.personId] : null;
    const nodeRoles = node.roles ? node.roles.map(roleId => roles[roleId]).filter(r => r) : [];
    
    // Determine card border color based on factory
    let borderColor = '#CC2030'; // Default PCI Red
    
    switch(currentFactory) {
      case 'ADD':
        borderColor = '#CC2030'; // PCI Red
        break;
      case 'BBV':
        borderColor = '#00518A'; // PCI Blue
        break;
      case 'SYN':
        borderColor = '#232323'; // PCI Dark Grey
        break;
      default:
        borderColor = '#CC2030';
    }
    
    return (
      <Card
        variant={isSelected ? "elevation" : "outlined"}
        elevation={isSelected ? 8 : 1}
        sx={{
          width: 220,
          maxWidth: '100%',
          minHeight: 150,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative',
          border: `2px solid ${isSelected ? borderColor : 'transparent'}`,
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          }
        }}
        onClick={() => handleNodeSelect(node)}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        <CardContent sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
            {node.title || 'Untitled Position'}
          </Typography>
          
          {person ? (
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: borderColor,
                  width: 50, 
                  height: 50, 
                  mb: 1 
                }}
              >
                {person.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="body1">{person.name}</Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#A8A8AA', // PCI Light Grey
                  width: 50, 
                  height: 50, 
                  mb: 1 
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Unassigned
              </Typography>
            </Box>
          )}
          
          {nodeRoles.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {nodeRoles.slice(0, 2).map((role, idx) => (
                <Chip 
                  key={idx}
                  label={role.title}
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {nodeRoles.length > 2 && (
                <Chip 
                  label={`+${nodeRoles.length - 2}`}
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                  color="primary"
                />
              )}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">
              No roles assigned
            </Typography>
          )}
          
          <IconButton 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 5, 
              right: 5,
              opacity: 0.7,
              '&:hover': { opacity: 1 }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, node);
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </CardContent>
      </Card>
    );
  };
  
  // Render connections between nodes
  const renderConnections = () => {
    return orgChart.connections.map((connection, index) => {
      const sourceNode = orgChart.nodes.find(n => n.id === connection.source);
      const targetNode = orgChart.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      // Line coordinates
      const x1 = sourceNode.position.x;
      const y1 = sourceNode.position.y + 75; // Bottom of source node
      const x2 = targetNode.position.x;
      const y2 = targetNode.position.y - 75; // Top of target node
      
      // Calculate control points for a curved line
      const midY = (y1 + y2) / 2;
      
      // Connection color based on factory
      let connectionColor = '#CC2030'; // Default PCI Red
      switch(currentFactory) {
        case 'ADD':
          connectionColor = '#CC2030'; // PCI Red
          break;
        case 'BBV':
          connectionColor = '#00518A'; // PCI Blue
          break;
        case 'SYN':
          connectionColor = '#232323'; // PCI Dark Grey
          break;
        default:
          connectionColor = '#CC2030';
      }
      
      return (
        <svg
          key={`connection-${index}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {/* Curved path */}
          <path
            d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
            stroke={connectionColor}
            strokeWidth={2}
            fill="none"
            strokeDasharray={sourceNode.temp || targetNode.temp ? "5,5" : "none"}
          />
          
          {/* Arrow tip */}
          <polygon
            points={`${x2},${y2} ${x2-5},${y2-10} ${x2+5},${y2-10}`}
            fill={connectionColor}
          />
        </svg>
      );
    });
  };
  
  // Factory color theme
  const getFactoryTheme = () => {
    switch(currentFactory) {
      case 'ADD':
        return {
          main: '#CC2030', // PCI Red
          light: '#e65c69',
          dark: '#a5101e',
        };
      case 'BBV':
        return {
          main: '#00518A', // PCI Blue
          light: '#4179b5',
          dark: '#003a62',
        };
      case 'SYN':
        return {
          main: '#232323', // PCI Dark Grey
          light: '#5c5c5c',
          dark: '#111111',
        };
      default:
        return {
          main: '#CC2030', // PCI Red
          light: '#e65c69',
          dark: '#a5101e',
        };
    }
  };
  
  const factoryTheme = getFactoryTheme();
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: isFullscreen ? '100vh' : '70vh',
        width: isFullscreen ? '100vw' : '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1300,
          borderRadius: 0,
        })
      }}
      ref={containerRef}
    >
      <Box
        ref={chartRef}
        sx={{
          transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.1s ease',
          height: '100%',
          width: '100%',
          cursor: isPanning ? 'grab' : 'default',
          '&:active': {
            cursor: isPanning ? 'grabbing' : 'default',
          },
          position: 'relative'
        }}
        onMouseDown={handlePanStart}
      >
        {/* Connections must be rendered first (behind nodes) */}
        {renderConnections()}
        
        {/* Render nodes by level */}
        {sortedLevels.map(level => (
          <Box
            key={`level-${level}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none', // Let clicks pass through to the nodes
            }}
          >
            {nodesByLevel[level].map(node => (
              <Box
                key={node.id}
                sx={{
                  position: 'absolute',
                  top: node.position.y,
                  left: node.position.x,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto', // Re-enable pointer events for the node
                }}
              >
                {renderNodeCard(node)}
              </Box>
            ))}
          </Box>
        ))}
        
        {/* Empty chart placeholder */}
        {orgChart.nodes.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              p: 4,
              maxWidth: 400
            }}
          >
            <GroupsIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Organization Structure
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start building your organization chart by adding positions.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleAddNode()}
            >
              Add First Position
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Control panel */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Tooltip title="Zoom Out">
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ px: 1, minWidth: 40, textAlign: 'center' }}>
          <Typography variant="body2">{zoom}%</Typography>
        </Box>
        
        <Tooltip title="Zoom In">
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Tooltip title="Fit to Screen">
          <IconButton onClick={handleFitToScreen} size="small">
            <FitScreenIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isPanning ? "Disable Pan" : "Enable Pan"}>
          <IconButton 
            onClick={togglePanMode} 
            size="small" 
            color={isPanning ? "primary" : "default"}
          >
            <PanToolIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={toggleFullscreen} size="small">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Paper>
      
      {/* Navigation guidance */}
      {orgChart.nodes.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleAddNode()}
            sx={{ 
              background: `linear-gradient(135deg, ${factoryTheme.main} 0%, ${factoryTheme.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${factoryTheme.light} 0%, ${factoryTheme.main} 100%)`,
              }
            }}
          >
            Add Position
          </Button>
        </Box>
      )}
      
      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleAddNode(contextMenu?.node)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add Position
        </MenuItem>
        
        {contextMenu?.node && (
          <MenuItem onClick={() => handleRemoveNode(contextMenu.node.id)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Remove Position
          </MenuItem>
        )}
        
        {contextMenu?.node && (
          <MenuItem onClick={handleCloseContextMenu}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Position
          </MenuItem>
        )}
        
        {contextMenu?.node && (
          <MenuItem onClick={handleCloseContextMenu}>
            <ListItemIcon>
              <AssignmentIndIcon fontSize="small" />
            </ListItemIcon>
            Assign Roles
          </MenuItem>
        )}
      </Menu>
      
      {/* Fullscreen title */}
      {isFullscreen && (
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            p: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            zIndex: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle1">
            {currentFactory} Organization Chart - Fullscreen Mode
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ModernOrgChart;