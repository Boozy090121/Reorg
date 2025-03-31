import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider, 
  Collapse,
  IconButton,
  Chip,
  Button,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RoleCreator from './RoleCreator';

const RoleItem = ({ role, index, onDragStart }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = (e) => {
    // Prevent expansion when starting drag
    if (e.target.closest('.drag-handle')) {
      return;
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <Draggable draggableId={role.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.6 : 1
            }}
          >
            <ListItem 
              button 
              onClick={handleToggleExpand}
              sx={{ 
                border: '1px solid #eee', 
                borderRadius: 1, 
                mb: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'inherit'
              }}
            >
              <ListItemIcon className="drag-handle" {...provided.dragHandleProps}>
                <DragIndicatorIcon />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {role.title}
                  </Typography>
                } 
                secondary={`Department: ${role.department}`} 
              />
              <IconButton edge="end" onClick={handleToggleExpand} size="small">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </ListItem>
          </div>
        )}
      </Draggable>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box 
          sx={{ 
            pl: 2, 
            pr: 2, 
            pb: 2, 
            pt: 1, 
            mb: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            backgroundColor: '#f9f9f9'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Responsibilities:
          </Typography>
          <List dense>
            {role.responsibilities.map((responsibility, idx) => (
              <ListItem key={idx} sx={{ py: 0 }}>
                <ListItemText 
                  primary={`• ${responsibility}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            Required Skills:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {role.requiredSkills.map((skill, idx) => (
              <Chip 
                key={idx} 
                label={skill} 
                size="small" 
                variant="outlined" 
                color="primary"
              />
            ))}
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Drag to org chart to add this role">
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<DragIndicatorIcon />}
              >
                Add to Org Chart
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </>
  );
};

const LeftPanel = ({ phase, factory }) => {
  const roles = useSelector(state => state.roles.roles[factory] || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [openRoleCreator, setOpenRoleCreator] = useState(false);
  
  // Get unique departments for filtering
  const departments = ['All', ...new Set(roles.map(role => role.department))];
  
  // Filter roles based on search term and department
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.responsibilities.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'All' || role.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleDepartmentChange = (dept) => {
    setDepartmentFilter(dept);
  };
  
  const handleOpenRoleCreator = () => {
    setOpenRoleCreator(true);
  };
  
  const handleCloseRoleCreator = () => {
    setOpenRoleCreator(false);
  };
  
  const handleDragStart = (result) => {
    // This would be implemented in step 009 (drag-and-drop functionality)
    console.log('Drag started:', result);
  };
  
  return (
    <Paper sx={{ height: '100%', overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Roles List
        </Typography>
        <Tooltip title="Create new role">
          <IconButton 
            color="primary" 
            onClick={handleOpenRoleCreator}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TextField
        fullWidth
        placeholder="Search Roles..."
        margin="normal"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
        {departments.map((dept) => (
          <Chip 
            key={dept}
            label={dept}
            onClick={() => handleDepartmentChange(dept)}
            color={departmentFilter === dept ? 'primary' : 'default'}
            variant={departmentFilter === dept ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <DragDropContext onDragStart={handleDragStart}>
          <Droppable droppableId="rolesList" isDropDisabled={true}>
            {(provided) => (
              <List 
                sx={{ mt: 1 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role, index) => (
                    <RoleItem 
                      key={role.id} 
                      role={role} 
                      index={index} 
                      onDragStart={handleDragStart}
                    />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No roles match your search criteria
                    </Typography>
                  </Box>
                )}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Drag roles to the org chart to add positions
        </Typography>
      </Box>
      
      <RoleCreator 
        factory={factory} 
        open={openRoleCreator} 
        onClose={handleCloseRoleCreator} 
      />
    </Paper>
  );
};

export default LeftPanel;
