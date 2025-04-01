import React from 'react';
import { Droppable, Draggable } from '../../utils/DragDropUtils';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Chip, 
  Box, 
  Collapse,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const LeftPanel = ({ roles, className, onAddRole, onDeleteRole }) => {
  const [expandedRoles, setExpandedRoles] = React.useState({});
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingRoleId, setEditingRoleId] = React.useState(null);
  const [newRole, setNewRole] = React.useState({
    title: '',
    responsibilities: []
  });
  const [newResponsibility, setNewResponsibility] = React.useState('');

  const toggleRoleExpand = (roleId) => {
    setExpandedRoles({
      ...expandedRoles,
      [roleId]: !expandedRoles[roleId]
    });
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNewRole({
      title: '',
      responsibilities: []
    });
    setNewResponsibility('');
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (role) => {
    setOpenEditDialog(true);
    setEditingRoleId(role.id);
    setNewRole({
      title: role.title,
      responsibilities: [...role.responsibilities]
    });
    setNewResponsibility('');
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingRoleId(null);
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setNewRole({
        ...newRole,
        responsibilities: [...newRole.responsibilities, newResponsibility.trim()]
      });
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index) => {
    const updatedResponsibilities = [...newRole.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setNewRole({
      ...newRole,
      responsibilities: updatedResponsibilities
    });
  };

  const handleSubmitNewRole = () => {
    if (newRole.title.trim() && newRole.responsibilities.length > 0) {
      onAddRole({
        id: `role-${Date.now()}`,
        title: newRole.title.trim(),
        responsibilities: newRole.responsibilities
      });
      handleCloseAddDialog();
    }
  };

  const handleUpdateRole = () => {
    if (newRole.title.trim() && newRole.responsibilities.length > 0 && editingRoleId) {
      onAddRole({
        id: editingRoleId,
        title: newRole.title.trim(),
        responsibilities: newRole.responsibilities
      });
      handleCloseEditDialog();
    }
  };

  return (
    <div className={className}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" className="panel-title">
          Roles & Responsibilities
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenAddDialog}
        >
          Add Role
        </Button>
      </Box>
      
      <Droppable droppableId="roles-list" isDropDisabled={true} type="ROLE">
        {(provided, snapshot) => (
          <List
            {...provided.droppableProps}
            ref={provided.innerRef}
            component={Paper}
            elevation={1}
            sx={{ 
              bgcolor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
              minHeight: '100px'
            }}
          >
            {Object.values(roles).map((role, index) => (
              <Draggable key={role.id} draggableId={role.id} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: snapshot.isDragging ? 'rgba(25, 118, 210, 0.12)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" component="span" onClick={() => toggleRoleExpand(role.id)}>
                            {role.title}
                          </Typography>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenEditDialog(role)}
                              sx={{ mr: 1 }}
                              title="Edit Role"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => onDeleteRole(role.id)}
                              sx={{ mr: 1 }}
                              title="Delete Role"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            {expandedRoles[role.id] ? 
                              <ExpandLessIcon onClick={() => toggleRoleExpand(role.id)} /> : 
                              <ExpandMoreIcon onClick={() => toggleRoleExpand(role.id)} />
                            }
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {Object.values(roles).length === 0 && (
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No roles available
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Droppable>

      {/* Expanded role details */}
      {Object.values(roles).map((role) => (
        <Collapse key={`details-${role.id}`} in={expandedRoles[role.id]} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
            <Typography variant="subtitle2" gutterBottom>
              Responsibilities:
            </Typography>
            <List dense>
              {role.responsibilities.map((resp, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <Chip 
                    label={resp} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid rgba(25, 118, 210, 0.2)'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              Drag this role to the organization chart to assign it.
            </Typography>
          </Paper>
        </Collapse>
      ))}

      {/* Add Role Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Title"
            fullWidth
            variant="outlined"
            value={newRole.title}
            onChange={(e) => setNewRole({...newRole, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Responsibilities:
          </Typography>
          
          <Box display="flex" mb={2}>
            <TextField
              margin="dense"
              label="Add Responsibility"
              fullWidth
              variant="outlined"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddResponsibility();
                  e.preventDefault();
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddResponsibility}
              sx={{ ml: 1, mt: 1 }}
            >
              Add
            </Button>
          </Box>
          
          <Paper variant="outlined" sx={{ p: 2, maxHeight: '200px', overflow: 'auto' }}>
            {newRole.responsibilities.length > 0 ? (
              <List dense>
                {newRole.responsibilities.map((resp, idx) => (
                  <ListItem 
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveResponsibility(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Chip label={resp} size="small" />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No responsibilities added yet
              </Typography>
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitNewRole}
            variant="contained"
            disabled={!newRole.title.trim() || newRole.responsibilities.length === 0}
          >
            Add Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Title"
            fullWidth
            variant="outlined"
            value={newRole.title}
            onChange={(e) => setNewRole({...newRole, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Responsibilities:
          </Typography>
          
          <Box display="flex" mb={2}>
            <TextField
              margin="dense"
              label="Add Responsibility"
              fullWidth
              variant="outlined"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddResponsibility();
                  e.preventDefault();
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddResponsibility}
              sx={{ ml: 1, mt: 1 }}
            >
              Add
            </Button>
          </Box>
          
          <Paper variant="outlined" sx={{ p: 2, maxHeight: '200px', overflow: 'auto' }}>
            {newRole.responsibilities.length > 0 ? (
              <List dense>
                {newRole.responsibilities.map((resp, idx) => (
                  <ListItem 
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveResponsibility(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Chip label={resp} size="small" />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No responsibilities added yet
              </Typography>
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateRole}
            variant="contained"
            disabled={!newRole.title.trim() || newRole.responsibilities.length === 0}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeftPanel;
