import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { setCurrentFactory } from '../../features/focusFactorySlice';

const FocusFactorySelector = () => {
  const dispatch = useDispatch();
  const { currentFactory, factories } = useSelector(state => state.focusFactory);
  // Convert factories object keys to array for mapping
  const factoryKeys = factories ? Object.keys(factories) : ['ADD', 'BBV', 'SYN'];
  
  const handleFactoryChange = (event, newFactory) => {
    if (newFactory !== null) {
      dispatch(setCurrentFactory(newFactory));
    }
  };
  
  const getFactoryDescription = (factory) => {
    switch(factory) {
      case 'ADD':
        return 'Advanced Drug Delivery - Focuses on innovative drug delivery systems including inhalers, auto-injectors, and transdermal patches.';
      case 'BBV':
        return 'Bottles, Blisters, Vials - Specializes in primary packaging solutions including glass and plastic containers, blister packs, and vials.';
      case 'SYN':
        return 'Syringes & Sterilization - Concentrates on sterile delivery systems including prefilled syringes, needles, and sterilization processes.';
      default:
        return '';
    }
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Tabs
        value={currentFactory}
        onChange={handleFactoryChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="focus factory tabs"
      >
        {factoryKeys.map(factory => (
          <Tab 
            key={factory} 
            label={factory} 
            value={factory} 
            icon={
              <Box 
                component="span" 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  display: 'inline-block',
                  bgcolor: factory === 'ADD' ? '#4caf50' : factory === 'BBV' ? '#2196f3' : '#ff9800',
                  mr: 1
                }} 
              />
            }
            iconPosition="start"
          />
        ))}
      </Tabs>
      
      <Tooltip title={getFactoryDescription(currentFactory)}>
        <IconButton size="small" sx={{ ml: 1 }}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FocusFactorySelector;
