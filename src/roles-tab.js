import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveIcon from '@mui/icons-material/Save';
import SortIcon from '@mui/icons-material/Sort';
import GroupIcon from '@mui/icons-material/Group';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { addRole, updateRole, removeRole } from './roleSlice';

const RolesAndResponsibilities = () => {
  const dispatch = useDispatch();
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  const roles = useSelector(state => state.roles.roles[currentFactory] || []);
  const personnelList = useSelector(state => state.personnel.personnel[currentFactory] || []);
  const assignments = useSelector(state => state.assignments);

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'detailed'
  const [selectedRole, setSelectedRole] = useState(null);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state for adding/editing roles
  const [roleForm, setRoleForm] = useState({
    title: '',
    department: '',
    responsibilities: [],
    requiredSkills: []
  });
  const [newItem, setNewItem] = useState(''); // For adding new responsibilities/skills

  // Filter and sort the roles list
  const filteredRoles = roles.filter(role => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      role.title.toLowerCase().includes(searchTermLower) ||
      role.department?.toLowerCase().includes(searchTermLower) ||
      role.responsibilities.some(r => r.toLowerCase().includes(searchTermLower)) ||
      role.requiredSkills.some(s => s.toLowerCase().includes(searchTermLower))
    );
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'department':
        comparison = (a.department || '').localeCompare(b.department || '');
        break;
      case 'responsibilities':
        comparison = a.responsibilities.length - b.responsibilities.length;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle opening the filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle closing the filter menu
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle sort direction change
  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Handle sort field change
  const handleSortByChange = (field) => {
    setSortBy(field);
    handleFilterClose();
  };

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  // Handle opening the add dialog
  const handleAddDialogOpen = () => {
    setRoleForm({
      title: '',
      department: '',
      responsibilities: [],
      requiredSkills: []
    });
    setAddDialogOpen(true);
  };

  // Handle opening the edit dialog
  const handleEditDialogOpen = (role) => {
    setRoleForm({
      id: role.id,
      title: role.title,
      department: role.department || '',
      responsibilities: [...role.responsibilities],
      requiredSkills: [...(role.requiredSkills || [])]
    });
    setEditDialogOpen(true);
  };

  // Handle opening the delete dialog
  const handleDeleteDialogOpen = (role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  // Handle adding a new responsibility
  const handleAddItem = (type) => {
    if (!newItem.trim()) return;
    
    if (type === 'responsibility') {
      setRoleForm({
        ...roleForm,
        responsibilities: [...roleForm.responsibilities, newItem.trim()]
      });
    } else if (type === 'skill') {
      setRoleForm({
        ...roleForm,
        requiredSkills: [...roleForm.requiredSkills, newItem.trim()]
      });
    }
    
    setNewItem('');
  };

  // Handle removing a responsibility
  const handleRemoveItem = (type, index) => {
    if (type === 'responsibility') {
      const newResponsibilities = [...roleForm.responsibilities];
      newResponsibilities.splice(index, 1);
      setRoleForm({
        ...roleForm,
        responsibilities: newResponsibilities
      });
    } else if (type === 'skill') {
      const newSkills = [...roleForm.requiredSkills];
      newSkills.splice(index, 1);
      setRoleForm({
        ...roleForm,
        requiredSkills: newSkills
      });
    }
  };

  // Handle submitting the add dialog
  const handleAddRole = () => {
    if (!roleForm.title.trim() || roleForm.responsibilities.length === 0) return;
    
    const newRole = {
      id: `${currentFactory.toLowerCase()}-${Date.now()}`,
      title: roleForm.title.trim(),
      department: roleForm.department.trim(),
      responsibilities: roleForm.responsibilities,
      requiredSkills: roleForm.requiredSkills
    };
    
    dispatch(addRole({
      factory: currentFactory,
      role: newRole
    }));
    
    setAddDialogOpen(false);
  };

  // Handle submitting the edit dialog
  const handleUpdateRole = () => {
    if (!roleForm.title.trim() || roleForm.responsibilities.length === 0) return;
    
    dispatch(updateRole({
      factory: currentFactory,
      roleId: roleForm.id,
      updatedRole: {
        title: roleForm.title.trim(),
        department: roleForm.department.trim(),
        responsibilities: roleForm.responsibilities,
        requiredSkills: roleForm.requiredSkills
      }
    }));
    
    setEditDialogOpen(false);
  };

  // Handle confirming the delete dialog
  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    dispatch(removeRole({
      factory: currentFactory,
      roleId: selectedRole.id
    }));
    
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  // Render the roles in card view
  const renderCardView = () => {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {sortedRoles.map(role => (
          <Grid item xs={12} sm={6} md={4} key={role.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                bgcolor: selectedRole?.id === role.id ? 'rgba(25, 118, 210, 0.1)' : 'transparent'
              }}
              onClick={() => handleRoleSelect(role)}
            >
              <CardHeader
                title={role.title}
                subheader={role.department}
                action={
                  <IconButton 
                    aria-label="options"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDialogOpen(role);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent sx={{ pt: 0, flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Responsibilities:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {role.responsibilities.slice(0, 3).map((resp, idx) => (
                    <Chip 
                      key={idx} 
                      label={resp} 
                      size="small" 
                      sx={{ 
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    />
                  ))}
                  {role.responsibilities.length > 3 && (
                    <Chip 
                      label={`+${role.responsibilities.length - 3} more`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {role.requiredSkills && role.requiredSkills.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.requiredSkills.slice(0, 2).map((skill, idx) => (
                        <Chip 
                          key={idx} 
                          label={skill} 
                          size="small" 
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                      {role.requiredSkills.length > 2 && (
                        <Chip 
                          label={`+${role.requiredSkills.length - 2} more`} 
                          size="small" 
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<PersonIcon />}
                >
                  Assignments
                </Button>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDialogOpen(role);
                  }}
                  sx={{ ml: 'auto' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render the roles in table view
  const renderTableView = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'title'}
                  direction={sortBy === 'title' ? sortDirection : 'asc'}
                  onClick={() => {
                    if (sortBy === 'title') {
                      handleSortDirectionChange();
                    } else {
                      handleSortByChange('title');
                    }
                  }}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'department'}
                  direction={sortBy === 'department' ? sortDirection : 'asc'}
                  onClick={() => {
                    if (sortBy === 'department') {
                      handleSortDirectionChange();
                    } else {
                      handleSortByChange('department');
                    }
                  }}
                >
                  Department
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'responsibilities'}
                  direction={sortBy === 'responsibilities' ? sortDirection : 'asc'}
                  onClick={() => {
                    if (sortBy === 'responsibilities') {
                      handleSortDirectionChange();
                    } else {
                      handleSortByChange('responsibilities');
                    }
                  }}
                >
                  Responsibilities
                </TableSortLabel>
              </TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRoles.map((role) => (
              <TableRow
                key={role.id}
                hover
                onClick={() => handleRoleSelect(role)}
                selected={selectedRole?.id === role.id}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  {role.title}
                </TableCell>
                <TableCell>{role.department}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.responsibilities.length > 0 ? (
                      <Chip 
                        label={`${role.responsibilities.length} items`} 
                        size="small" 
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.requiredSkills && role.requiredSkills.length > 0 ? (
                      <Chip 
                        label={`${role.requiredSkills.length} skills`} 
                        size="small" 
                        color="secondary"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDialogOpen(role);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDialogOpen(role);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render the detailed view
  const renderDetailedView = () => {
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              maxHeight: '70vh',
              overflow: 'auto'
            }}
          >
            <List dense>
              {sortedRoles.map(role => (
                <ListItem 
                  key={role.id}
                  selected={selectedRole?.id === role.id}
                  onClick={() => handleRoleSelect(role)}
                  sx={{ cursor: 'pointer' }}
                  secondaryAction={
                    <IconButton 
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDialogOpen(role);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={role.title}
                    secondary={role.department}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {selectedRole ? (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                height: '100%',
                maxHeight: '70vh',
                overflow: 'auto'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6">{selectedRole.title}</Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => handleEditDialogOpen(selectedRole)}
                >
                  Edit
                </Button>
              </Box>
              
              <Typography variant="subtitle2">Department:</Typography>
              <Typography variant="body1" paragraph>
                {selectedRole.department || 'Not specified'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Responsibilities:
              </Typography>
              <List dense>
                {selectedRole.responsibilities.map((resp, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={resp} />
                  </ListItem>
                ))}
              </List>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Required Skills:
              </Typography>
              {selectedRole.requiredSkills && selectedRole.requiredSkills.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedRole.requiredSkills.map((skill, idx) => (
                    <Chip 
                      key={idx} 
                      label={skill} 
                      size="small" 
                      color="secondary"
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific skills required
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Personnel Assignments:
              </Typography>
              {/* Display personnel assignments here */}
            </Paper>
          ) : (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                Select a role to view details
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
                sx={{ mt: 2 }}
              >
                Add New Role
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Roles & Responsibilities - {currentFactory}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <TextField
          placeholder="Search roles..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter/Sort Options">
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleSortByChange('title')}>
              Sort by Title
            </MenuItem>
            <MenuItem onClick={() => handleSortByChange('department')}>
              Sort by Department
            </MenuItem>
            <MenuItem onClick={() => handleSortByChange('responsibilities')}>
              Sort by # of Responsibilities
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSortDirectionChange}>
              {sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            </MenuItem>
          </Menu>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddDialogOpen}
          >
            Add Role
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={viewMode}
          onChange={handleViewModeChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="cards" label="Cards" />
          <Tab value="table" label="Table" />
          <Tab value="detailed" label="Detailed" />
        </Tabs>
      </Box>
      
      <Box>
        {viewMode === 'cards' && renderCardView()}
        {viewMode === 'table' && renderTableView()}
        {viewMode === 'detailed' && renderDetailedView()}
      </Box>
      
      {/* Add Role Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role Title"
                fullWidth
                value={roleForm.title}
                onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={roleForm.department}
                onChange={(e) => setRoleForm({ ...roleForm, department: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Responsibilities:
              </Typography>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add responsibility"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('responsibility');
                      e.preventDefault();
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleAddItem('responsibility')}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 1, maxHeight: '200px', overflow: 'auto' }}>
                <List dense>
                  {roleForm.responsibilities.map((resp, idx) => (
                    <ListItem
                      key={idx}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => handleRemoveItem('responsibility', idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={resp} />
                    </ListItem>
                  ))}
                  {roleForm.responsibilities.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                      No responsibilities added yet
                    </Typography>
                  )}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                Required Skills:
              </Typography>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add required skill"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('skill');
                      e.preventDefault();
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleAddItem('skill')}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 1, maxHeight: '150px', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1 }}>
                  {roleForm.requiredSkills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      onDelete={() => handleRemoveItem('skill', idx)}
                      size="small"
                    />
                  ))}
                  {roleForm.requiredSkills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddRole}
            variant="contained"
            disabled={!roleForm.title.trim() || roleForm.responsibilities.length === 0}
          >
            Add Role
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Role Dialog - Similar to Add Dialog with pre-filled values */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          {/* Same as Add Dialog with pre-filled values */}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role Title"
                fullWidth
                value={roleForm.title}
                onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={roleForm.department}
                onChange={(e) => setRoleForm({ ...roleForm, department: e.target.value })}
              />
            </Grid>
            
            {/* Rest of the form fields */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateRole}
            variant="contained"
            disabled={!roleForm.title.trim() || roleForm.responsibilities.length === 0}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Role Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{selectedRole?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteRole}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesAndResponsibilities;