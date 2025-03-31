import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

// Custom styled components for consistent UI elements
const SectionHeader = ({ children, ...props }) => {
  const theme = useTheme();
  
  return (
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 500,
        color: theme.palette.primary.main,
        mb: 2,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

const SectionSubheader = ({ children, ...props }) => {
  return (
    <Typography 
      variant="subtitle1" 
      sx={{ 
        fontWeight: 500,
        mb: 1,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

const ContentCard = ({ children, ...props }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

const StatusBadge = ({ status, ...props }) => {
  const theme = useTheme();
  
  const getStatusColor = () => {
    switch(status) {
      case 'active':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'inactive':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: 'inline-block',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        backgroundColor: getStatusColor(),
        color: '#fff',
        ...props.sx
      }}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Box>
  );
};

const FocusFactoryBadge = ({ factory, ...props }) => {
  const theme = useTheme();
  
  const getFactoryColor = () => {
    switch(factory) {
      case 'ADD':
        return theme.palette.focusFactory.ADD;
      case 'BBV':
        return theme.palette.focusFactory.BBV;
      case 'SYN':
        return theme.palette.focusFactory.SYN;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        backgroundColor: getFactoryColor(),
        color: '#fff',
        ...props.sx
      }}
      {...props}
    >
      <Box 
        sx={{ 
          width: 8, 
          height: 8, 
          borderRadius: '50%', 
          backgroundColor: '#fff',
          mr: 0.5
        }} 
      />
      {factory}
    </Box>
  );
};

export { 
  SectionHeader, 
  SectionSubheader, 
  ContentCard, 
  StatusBadge,
  FocusFactoryBadge
};
