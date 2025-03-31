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
  ListItemSecondaryAction,
  Divider, 
  Collapse,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PersonnelDetails from './PersonnelDetails';
import PersonnelCreator from './PersonnelCreator';

const PersonnelItem = ({ person, index, onDragStart }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = (e) => {
    // Prevent expansion when starting drag
    if (e.target.closest('.drag-handle')) {
      return;
    }
    setExpanded(!expanded);
  };

  // Function to determine chip color based on availability
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'Available':
        return 'success';
      case 'Partially Available':
        return 'warning';
      case 'Assigned':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Draggable draggableId={person.id} index={index}>
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
                    {person.name}
                  </Typography>
                } 
                secondary={`Current: ${person.currentRole}`} 
              />
              <ListItemSecondaryAction>
                <Chip 
                  label={person.availability} 
                  size="small" 
                  color={getAvailabilityColor(person.availability)} 
                />
              </ListItemSecondaryAction>
            </ListItem>
          </div>
        )}
      </Draggable>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <PersonnelDetails person={person} />
      </Collapse>
    </>
  );
};

const RightPanel = ({ phase, factory }) => {
  const personnel = useSelector(state => state.personnel.personnel[factory] || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [openPersonnelCreator, setOpenPersonnelCreator] = useState(false);
  
  // Get unique availability statuses for filtering
  const availabilityOptions = ['All', ...new Set(personnel.map(person => person.availability))];
  
  // Filter personnel based on search term and availability
  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailability = availabilityFilter === 'All' || person.availability === availabilityFilter;
    
    return matchesSearch && matchesAvailability;
  });
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleAvailabilityChange = (availability) => {
    setAvailabilityFilter(availability);
  };
  
  const handleOpenPersonnelCreator = () => {
    setOpenPersonnelCreator(true);
  };
  
  const handleClosePersonnelCreator = () => {
    setOpenPersonnelCreator(false);
  };
  
  const handleDragStart = (result) => {
    // This would be implemented in step 009 (drag-and-drop functionality)
    console.log('Drag started:', result);
  };
  
  return (
    <Paper sx={{ height: '100%', overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Personnel List
        </Typography>
        <Tooltip title="Add new personnel">
          <IconButton 
            color="primary" 
            size="small"
            onClick={handleOpenPersonnelCreator}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TextField
        fullWidth
        placeholder="Search Personnel..."
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
        {availabilityOptions.map((availability) => (
          <Chip 
            key={availability}
            label={availability}
            onClick={() => handleAvailabilityChange(availability)}
            color={availabilityFilter === availability ? 'primary' : 'default'}
            variant={availabilityFilter === availability ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <DragDropContext onDragStart={handleDragStart}>
          <Droppable droppableId="personnelList" isDropDisabled={true}>
            {(provided) => (
              <List 
                sx={{ mt: 1 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredPersonnel.length > 0 ? (
                  filteredPersonnel.map((person, index) => (
                    <PersonnelItem 
                      key={person.id} 
                      person={person} 
                      index={index} 
                      onDragStart={handleDragStart}
                    />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No personnel match your search criteria
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
          Drag personnel to roles in the org chart to assign
        </Typography>
      </Box>
      
      <PersonnelCreator 
        factory={factory} 
        open={openPersonnelCreator} 
        onClose={handleClosePersonnelCreator} 
      />
    </Paper>
  );
};

export default RightPanel;
