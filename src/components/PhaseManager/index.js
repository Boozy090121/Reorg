import React from 'react';
import { Box } from '@mui/material';
import PhaseManager from './PhaseManager';
import PhaseInitializer from './PhaseInitializer';
import PhaseComparison from './PhaseComparison';
import PhaseTransition from './PhaseTransition';

const PhaseManagementContainer = ({ phase, factory }) => {
  const [showInitializer, setShowInitializer] = React.useState(true);
  
  const handleInitializerClose = () => {
    setShowInitializer(false);
  };
  
  return (
    <Box>
      <PhaseManager />
      
      {/* Show phase initializer dialog when appropriate */}
      {showInitializer && (
        <PhaseInitializer 
          phase={phase} 
          factory={factory} 
          onClose={handleInitializerClose} 
        />
      )}
      
      {/* Show phase comparison when in future state */}
      {phase === 'future' && (
        <PhaseComparison factory={factory} />
      )}
      
      {/* Show phase transition options */}
      <PhaseTransition />
    </Box>
  );
};

export default PhaseManagementContainer;
