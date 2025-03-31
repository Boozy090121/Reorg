import React from 'react';
import { Droppable, Draggable } from '../utils/DragDropUtils';
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
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const RightPanel = ({ personnel, className, onAddPersonnel, onDeletePersonnel }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newPerson, setNewPerson] = React.useState({
    name: '',
    skills: []
  });
  const [newSkill, setNewSkill] = React.useState('');
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Filter personnel based on search term
  const filteredPersonnel = Object.values(personnel).filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNewPerson({
      name: '',
      skills: []
    });
    setNewSkill('');
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setNewPerson({
        ...newPerson,
        skills: [...newPerson.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...newPerson.skills];
    updatedSkills.splice(index, 1);
    setNewPerson({
      ...newPerson,
      skills: updatedSkills
    });
  };

  const handleSubmitNewPerson = () => {
    if (newPerson.name.trim()) {
      onAddPersonnel({
        id: `person-${Date.now()}`,
        name: newPerson.name.trim(),
        skills: newPerson.skills.length > 0 ? newPerson.skills : ['No skills specified']
      });
      handleCloseAddDialog();
    }
  };

  return (
    <div className={className}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" className="panel-title">
          Available Personnel
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenAddDialog}
        >
          Add Person
        </Button>
      </Box>
      
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
      
      <Droppable droppableId="personnel-list" isDropDisabled={true} type="PERSONNEL">
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
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{person.name}</Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => onDeletePersonnel(person.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
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

      {/* Add Personnel Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Personnel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newPerson.name}
            onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Skills:
          </Typography>
          
          <Box display="flex" mb={2}>
            <TextField
              margin="dense"
              label="Add Skill"
              fullWidth
              variant="outlined"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddSkill();
                  e.preventDefault();
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddSkill}
              sx={{ ml: 1, mt: 1 }}
            >
              Add
            </Button>
          </Box>
          
          <Paper variant="outlined" sx={{ p: 2, maxHeight: '200px', overflow: 'auto' }}>
            {newPerson.skills.length > 0 ? (
              <List dense>
                {newPerson.skills.map((skill, idx) => (
                  <ListItem 
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveSkill(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Chip label={skill} size="small" />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No skills added yet
              </Typography>
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitNewPerson}
            variant="contained"
            disabled={!newPerson.name.trim()}
          >
            Add Person
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RightPanel;
