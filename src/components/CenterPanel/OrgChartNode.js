import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const OrgChartNode = ({ node, isSelected, onSelect }) => {
  const personnel = useSelector(state => {
    // Find the person assigned to this node
    const factory = node.id.split('-')[0]; // Extract factory code from node ID
    const allPersonnel = state.personnel.personnel[factory.toUpperCase()] || [];
    return allPersonnel.find(person => person.id === node.personId);
  });
  
  // Determine if the node has a person assigned
  const hasAssignedPerson = !!node.personId && !!personnel;
  
  // Handle node click
  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(node.id);
    }
  };
  
  return (
    <Paper
      className="org-chart-node"
      elevation={isSelected ? 8 : 2}
      sx={{
        position: 'absolute',
        top: node.position.y,
        left: node.position.x,
        width: 180,
        padding: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        transform: 'translate(-50%, -50%)', // Center the node on its position
        zIndex: isSelected ? 10 : 1,
        transition: 'all 0.2s ease-out',
        '&:hover': {
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5'
        }
      }}
      onClick={handleClick}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="medium" 
          gutterBottom
          sx={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}
        >
          {node.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          {hasAssignedPerson ? (
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'primary.main',
                fontSize: '1rem'
              }}
            >
              {personnel.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
          ) : (
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'grey.300',
                color: 'grey.600'
              }}
            >
              <PersonOffIcon />
            </Avatar>
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color={hasAssignedPerson ? 'text.primary' : 'text.secondary'}
          sx={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}
        >
          {hasAssignedPerson ? personnel.name : '[Unassigned]'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OrgChartNode;
