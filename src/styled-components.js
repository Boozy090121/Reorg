import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  IconButton,
  Chip,
  Divider,
  Badge,
  styled,
  alpha
} from '@mui/material';
import { keyframes } from '@mui/system';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Enhanced Page Container
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`
}));

// Page Header
export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2)
    }
  }
}));

// Section title with optional actions
export const SectionTitle = ({ title, subtitle, actions, children }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    mb: 2
  }}>
    <Box>
      <Typography variant="h5" fontWeight="500" gutterBottom={!!subtitle}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    
    {actions && (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {actions}
      </Box>
    )}
    
    {children}
  </Box>
);

// Enhanced Card
export const EnhancedCard = styled(Card)(({ theme, headerColor }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  overflow: 'visible',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)'
  },
  '&::before': headerColor ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: `linear-gradient(90deg, ${headerColor} 0%, ${headerColor}90 100%)`,
    borderTopLeftRadius: theme.shape.borderRadius * 1.5,
    borderTopRightRadius: theme.shape.borderRadius * 1.5
  } : undefined
}));

// Card with gradient header
export const GradientHeaderCard = ({ 
  title, 
  subtitle, 
  children, 
  color = 'primary',
  actions,
  ...props 
}) => {
  
  // Get gradient colors based on theme color
  const getGradient = (colorName) => {
    const colors = {
      primary: 'linear-gradient(135deg, #CC2030 0%, #a5101e 100%)',
      secondary: 'linear-gradient(135deg, #00518A 0%, #003a62 100%)',
      info: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
      success: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
      warning: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
      error: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
      default: 'linear-gradient(135deg, #757575 0%, #424242 100%)'
    };
    
    return colors[colorName] || colors.default;
  };
  
  return (
    <Card 
      elevation={3} 
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
      {...props}
    >
      <Box sx={{ 
        p: 2, 
        background: getGradient(color),
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" fontWeight="500">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box>
            {actions}
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </CardContent>
    </Card>
  );
};

// Action button with gradient
export const GradientButton = styled(Button)(({ theme, color = 'primary' }) => {
  const getColorValue = () => {
    if (color === 'primary') return theme.palette.primary.main;
    if (color === 'secondary') return theme.palette.secondary.main;
    if (color in theme.palette.focusFactory) return theme.palette.focusFactory[color];
    return color; // If a custom color is passed
  };
  
  const mainColor = getColorValue();
  const darkColor = color === 'primary' ? theme.palette.primary.dark : 
                   color === 'secondary' ? theme.palette.secondary.dark : 
                   `${mainColor}dd`;
                   
  return {
    background: `linear-gradient(135deg, ${mainColor} 0%, ${darkColor} 100%)`,
    color: '#ffffff',
    borderRadius: theme.shape.borderRadius * 1.2,
    textTransform: 'none',
    fontWeight: 500,
    padding: '8px 16px',
    boxShadow: `0 4px 10px ${mainColor}40`,
    '&:hover': {
      boxShadow: `0 6px 15px ${mainColor}60`,
      background: `linear-gradient(135deg, ${mainColor} 30%, ${darkColor} 100%)`
    }
  };
});

// Badge with custom styling
export const PCIBadge = styled(Badge)(({ theme, color = 'primary' }) => {
  const badgeColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main
  };
  
  return {
    '& .MuiBadge-badge': {
      backgroundColor: badgeColors[color] || badgeColors.primary,
      color: 'white',
      fontWeight: 'bold',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
    }
  };
});

// Animated panel
export const AnimatedPanel = styled(Paper)(({ theme, delay = 0 }) => ({
  animation: `${slideUp} 0.5s ease-out ${delay}s both`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: 'hidden'
}));

// Enhanced chip with factory color
export const FactoryChip = ({ factory, ...props }) => {
  // Determine color based on factory
  const getFactoryColor = (factoryCode) => {
    switch(factoryCode) {
      case 'ADD':
        return { 
          bg: '#CC2030',  // PCI Red
          text: '#ffffff' 
        };
      case 'BBV':
        return { 
          bg: '#00518A', // PCI Blue
          text: '#ffffff' 
        };
      case 'SYN':
        return { 
          bg: '#232323', // PCI Dark Grey
          text: '#ffffff' 
        };
      default:
        return { 
          bg: '#A8A8AA', // PCI Light Grey
          text: '#232323' 
        };
    }
  };
  
  const colorSet = getFactoryColor(factory);
  
  return (
    <Chip
      label={factory}
      sx={{
        backgroundColor: colorSet.bg,
        color: colorSet.text,
        fontWeight: 'bold',
        '& .MuiChip-label': {
          padding: '0 8px'
        }
      }}
      {...props}
    />
  );
};

// Status chip
export const StatusChip = ({ status, label, ...props }) => {
  // Define styles for different statuses
  const getStatusStyle = (statusCode) => {
    switch(statusCode) {
      case 'active':
      case 'completed':
      case 'approved':
        return {
          bgcolor: alpha('#4caf50', 0.15),
          color: '#2e7d32',
          borderColor: alpha('#4caf50', 0.3)
        };
      case 'pending':
      case 'in-progress':
      case 'in-review':
        return {
          bgcolor: alpha('#2196f3', 0.15),
          color: '#0d47a1',
          borderColor: alpha('#2196f3', 0.3)
        };
      case 'inactive':
      case 'on-hold':
      case 'waiting':
        return {
          bgcolor: alpha('#ff9800', 0.15),
          color: '#e65100',
          borderColor: alpha('#ff9800', 0.3)
        };
      case 'rejected':
      case 'canceled':
      case 'error':
        return {
          bgcolor: alpha('#f44336', 0.15),
          color: '#c62828',
          borderColor: alpha('#f44336', 0.3)
        };
      default:
        return {
          bgcolor: alpha('#9e9e9e', 0.15),
          color: '#616161',
          borderColor: alpha('#9e9e9e', 0.3)
        };
    }
  };
  
  const style = getStatusStyle(status);
  
  return (
    <Chip
      label={label || status}
      variant="outlined"
      size="small"
      sx={{
        ...style,
        textTransform: 'capitalize',
        fontWeight: 500,
      }}
      {...props}
    />
  );
};

// Custom divider with label
export const LabeledDivider = ({ label, ...props }) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      my: 2,
      ...props.sx
    }}
  >
    <Divider sx={{ flexGrow: 1 }} />
    {label && (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          px: 2,
          textTransform: 'uppercase',
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Typography>
    )}
    <Divider sx={{ flexGrow: 1 }} />
  </Box>
);

// Empty state component
export const EmptyState = ({ 
  icon, 
  title = 'No Data Available', 
  description = 'There are no items to display at this time.', 
  action,
  ...props 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 4,
      height: '100%',
      width: '100%',
      ...props.sx
    }}
  >
    {icon && (
      <Box sx={{ mb: 2, color: 'text.disabled', '& svg': { fontSize: 64 } }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
      {description}
    </Typography>
    {action}
  </Box>
);

export default {
  PageContainer,
  PageHeader,
  SectionTitle,
  EnhancedCard,
  GradientHeaderCard,
  GradientButton,
  PCIBadge,
  AnimatedPanel,
  FactoryChip,
  StatusChip,
  LabeledDivider,
  EmptyState
};