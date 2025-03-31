import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import FocusFactoryTemplate from './FocusFactoryTemplate';

const FocusFactoryManager = () => {
  const dispatch = useDispatch();
  const { currentFactory } = useSelector(state => state.focusFactory);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const factories = ['ADD', 'BBV', 'SYN'];
  
  return (
    <>
      <Button 
        variant="outlined" 
        size="small" 
        onClick={handleOpen}
        sx={{ ml: 2 }}
      >
        View Factory Template
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Focus Factory Templates
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange}
              variant="fullWidth"
            >
              {factories.map((factory, index) => (
                <Tab 
                  key={factory} 
                  label={factory} 
                  id={`factory-tab-${index}`}
                  aria-controls={`factory-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>
          
          {factories.map((factory, index) => (
            <div
              key={factory}
              role="tabpanel"
              hidden={selectedTab !== index}
              id={`factory-tabpanel-${index}`}
              aria-labelledby={`factory-tab-${index}`}
            >
              {selectedTab === index && (
                <FocusFactoryTemplate factory={factory} />
              )}
            </div>
          ))}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            These templates provide standardized organizational structures for each focus factory.
            Use them as a starting point when creating your quality reorganization plans.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Logic to apply template would go here
              handleClose();
            }}
          >
            Apply Template
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FocusFactoryManager;
