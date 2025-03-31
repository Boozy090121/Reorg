import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { addPersonnel } from '../../features/personnelSlice';

const PersonnelCreator = ({ factory, open, onClose }) => {
  const dispatch = useDispatch();
  const [personnelData, setPersonnelData] = React.useState({
    name: '',
    currentRole: '',
    skills: '',
    experience: '',
    availability: 'Available'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonnelData({
      ...personnelData,
      [name]: value
    });
  };
  
  const handleSubmit = () => {
    // Create a new personnel object
    const newPerson = {
      id: `person-${Date.now()}`,
      name: personnelData.name,
      currentRole: personnelData.currentRole,
      skills: personnelData.skills.split('\n').filter(s => s.trim() !== ''),
      experience: personnelData.experience.split('\n').filter(e => e.trim() !== ''),
      availability: personnelData.availability
    };
    
    // Dispatch action to add the personnel
    dispatch(addPersonnel({
      factory,
      person: newPerson
    }));
    
    // Reset form and close dialog
    setPersonnelData({
      name: '',
      currentRole: '',
      skills: '',
      experience: '',
      availability: 'Available'
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Personnel</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={personnelData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <TextField
            label="Current Role"
            name="currentRole"
            value={personnelData.currentRole}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <TextField
            label="Skills (one per line)"
            name="skills"
            value={personnelData.skills}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            helperText="Enter each skill on a new line"
          />
          
          <TextField
            label="Experience (one per line)"
            name="experience"
            value={personnelData.experience}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            helperText="Enter each experience item on a new line"
          />
          
          <TextField
            select
            label="Availability"
            name="availability"
            value={personnelData.availability}
            onChange={handleInputChange}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="Available">Available</option>
            <option value="Partially Available">Partially Available</option>
            <option value="Assigned">Assigned</option>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!personnelData.name || !personnelData.currentRole}
        >
          Add Personnel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonnelCreator;
