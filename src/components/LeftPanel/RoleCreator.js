import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { addRole } from '../../features/roleSlice';

const RoleCreator = ({ factory, open, onClose }) => {
  const dispatch = useDispatch();
  const [roleData, setRoleData] = React.useState({
    title: '',
    department: '',
    responsibilities: '',
    requiredSkills: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleData({
      ...roleData,
      [name]: value
    });
  };
  
  const handleSubmit = () => {
    // Create a new role object
    const newRole = {
      id: `${factory.toLowerCase()}-${Date.now()}`,
      title: roleData.title,
      department: roleData.department,
      responsibilities: roleData.responsibilities.split('\n').filter(r => r.trim() !== ''),
      requiredSkills: roleData.requiredSkills.split('\n').filter(s => s.trim() !== '')
    };
    
    // Dispatch action to add the role
    dispatch(addRole({
      factory,
      role: newRole
    }));
    
    // Reset form and close dialog
    setRoleData({
      title: '',
      department: '',
      responsibilities: '',
      requiredSkills: ''
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Role</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Role Title"
            name="title"
            value={roleData.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <TextField
            label="Department"
            name="department"
            value={roleData.department}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <TextField
            label="Responsibilities (one per line)"
            name="responsibilities"
            value={roleData.responsibilities}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            helperText="Enter each responsibility on a new line"
          />
          
          <TextField
            label="Required Skills (one per line)"
            name="requiredSkills"
            value={roleData.requiredSkills}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            helperText="Enter each skill on a new line"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!roleData.title || !roleData.department}
        >
          Create Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleCreator;
