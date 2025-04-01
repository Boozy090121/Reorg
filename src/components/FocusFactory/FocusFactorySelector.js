import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Button, 
  Chip 
} from '@mui/material';
import { setCurrentFactory } from '../../features/focusFactorySlice';
import pciTheme from '../../pci-theme';

const FocusFactorySelector = ({ compact = false }) => {
  const dispatch = useDispatch();
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  
  // Available factories
  const factories = ['ADD', 'BBV', 'SYN'];
  
  const handleFactoryChange = (factory) => {
    dispatch(setCurrentFactory(factory));
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant={compact ? "subtitle2" : "subtitle1"} 
        gutterBottom
      >
        Focus Factory
      </Typography>
      
      {/* Render compact view for sidebar */}
      {compact ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {factories.map(factory => (
            <Button
              key={factory}
              variant={factory === currentFactory ? "contained" : "outlined"}
              size="small"
              fullWidth
              onClick={() => handleFactoryChange(factory)}
              sx={{
                borderColor: pciTheme.palette.focusFactory[factory],
                color: factory === currentFactory ? 'white' : pciTheme.palette.focusFactory[factory],
                bgcolor: factory === currentFactory ? pciTheme.palette.focusFactory[factory] : 'transparent',
                '&:hover': {
                  bgcolor: factory === currentFactory 
                    ? pciTheme.palette.focusFactory[factory] 
                    : pciTheme.palette.focusFactory[factory]
                }
              }}
            >
              {factory}
            </Button>
          ))}
        </Box>
      ) : (
        <ToggleButtonGroup
          value={currentFactory}
          exclusive
          onChange={(event, newValue) => {
            handleFactoryChange(newValue);
          }}
          aria-label="Focus Factory"
        >
          {factories.map(factory => (
            <ToggleButton
              key={factory}
              value={factory}
              aria-label={factory}
            >
              {factory}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default FocusFactorySelector; 