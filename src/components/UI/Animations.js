import React from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const AnimatedBox = ({ children, delay = 0, animation = 'fade', ...props }) => {
  const animationStyle = animation === 'slide' 
    ? { animation: `${slideIn} 0.5s ease-out forwards ${delay}s` }
    : { animation: `${fadeIn} 0.5s ease-out forwards ${delay}s` };
  
  return (
    <Box 
      sx={{ 
        opacity: 0,
        ...animationStyle
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const TransitionContainer = ({ children, in: inProp, ...props }) => {
  return (
    <Fade in={inProp} timeout={300} {...props}>
      <div>{children}</div>
    </Fade>
  );
};

export { AnimatedBox, TransitionContainer };
