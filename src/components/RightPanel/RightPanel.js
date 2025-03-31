import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

const RightPanel = ({ personnel, className }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Filter personnel based on search term
  const filteredPersonnel = Object.values(personnel).filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={className}>
      <Typography variant="h6" className="panel-title">
        Available Personnel
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search by name or skill"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Droppable droppableId="personnel-list" isDropDisabled={true}>
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
            {filteredPersonnel.map((person, index) => (
              <Draggable key={person.id} draggableId={person.id} index={index}>
                {(provided, snapshot) => (
                  <React.Fragment>
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
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={person.name}
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            {person.skills.map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.5,
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                              />
                            ))}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredPersonnel.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {filteredPersonnel.length === 0 && (
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'No matching personnel found' : 'No personnel available'}
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Droppable>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
        Drag personnel to roles in the organization chart to assign them.
      </Typography>
    </div>
  );
};

export default RightPanel;
