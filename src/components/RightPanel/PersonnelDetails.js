import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';

const PersonnelDetails = ({ person }) => {
  return (
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
        Skills:
      </Typography>
      <List dense>
        {person.skills.map((skill, idx) => (
          <ListItem key={idx} sx={{ py: 0 }}>
            <ListItemText 
              primary={`• ${skill}`}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
        Experience:
      </Typography>
      <List dense>
        {person.experience.map((exp, idx) => (
          <ListItem key={idx} sx={{ py: 0 }}>
            <ListItemText 
              primary={`• ${exp}`}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">
          Availability:
        </Typography>
        <Chip 
          label={person.availability} 
          size="small" 
          color={
            person.availability === 'Available' ? 'success' : 
            person.availability === 'Partially Available' ? 'warning' : 'error'
          } 
        />
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          ID: {person.id}
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonnelDetails;
