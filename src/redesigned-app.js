import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  useMediaQuery
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterListIcon from '@mui/icons-material/FilterList';

// Import custom theme
import pciTheme from './theme/pciTheme';

// Import components
import ModernOrgChart from './components/ModernOrgChart';
import FlexibleLayout from './components/FlexibleLayout';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import PhaseManager from './components/PhaseManager/PhaseManager';
import FocusFactorySelector from './components/FocusFactory/FocusFactorySelector';
import RolesAndResponsibilities from './components/RolesAndResponsibilities';
import QualityProcessFlow from './components/QualityProcessFlow';
import { EnhancedDragDropProvider } from './utils/DragDropUtils';
import store from './store';

// Logo component
const PCILogo = ({ size = 'default' }) => {
  const styles = {
    default: {
      height: 40
    },
    small: {
      height: 32
    },
    large: {
      height: 48
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Replace with actual logo */}
      <Box 
        sx={{ 
          bgcolor: '#CC2030',
          color: 'white',
          fontWeight: 'bold',
          fontSize: size === 'small' ? 18 : 22,
          p: size === 'small' ? 0.7 : 1,
          borderRadius: 1,
          mr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: styles[size].height,
          width: styles[size].height * 1.8
        }}
      >
        PCI
      </Box>
      <Typography 
        variant={size === 'small' ? 'subtitle1' : 'h6'} 
        fontWeight="500" 
        sx={{ color: '#232323' }}
      >
        Quality Reorg
      </Typography>
    </Box>
  );
};

// App component
const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTab, setCurrentTab] = useState('organization');
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  
  const isMobile = useMediaQuery(pciTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(pciTheme.breakpoints.down('lg'));
  
  // Toggle drawer
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Handle notifications menu
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Handle settings menu
  const handleSettingsOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  
  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };
  
  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'organization':
        return (
          <EnhancedDragDropProvider>
            <FlexibleLayout
              leftPanel={<LeftPanel />}
              centerPanel={<ModernOrgChart />}
              rightPanel={<RightPanel />}
            />
          </EnhancedDragDropProvider>
        );
      case 'roles':
        return <RolesAndResponsibilities />;
      case 'process':
        return <QualityProcessFlow />;
      default:
        return <Box p={3}>Coming Soon</Box>;
    }
  };
  
  return (
    <ThemeProvider theme={pciTheme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            background: 'linear-gradient(90deg, #CC2030 0%, #a5101e 100%)'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <PCILogo />
            </Box>
            
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                ml: { xs: 0, md: 4 }
              }}
            >
              {!isMobile && (
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant={isTablet ? "scrollable" : "standard"}
                  scrollButtons={isTablet ? "auto" : false}
                  aria-label="main navigation tabs"
                  sx={{ 
                    '& .MuiTab-root': { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-selected': {
                        color: '#ffffff'
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#ffffff'
                    }
                  }}
                >
                  <Tab 
                    label="Organization Chart" 
                    value="organization" 
                    icon={<BusinessIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Roles & Responsibilities" 
                    value="roles" 
                    icon={<AssignmentIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Process Flow" 
                    value="process" 
                    icon={<AccountTreeIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Dashboard" 
                    value="dashboard" 
                    icon={<DashboardIcon />} 
                    iconPosition="start"
                    disabled
                  />
                  <Tab 
                    label="Reports" 
                    value="reports" 
                    icon={<BarChartIcon />} 
                    iconPosition="start"
                    disabled
                  />
                </Tabs>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                aria-label="save"
                size="large"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <SaveIcon />
              </IconButton>
              
              <IconButton 
                color="inherit" 
                aria-label="notifications"
                size="large"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton 
                color="inherit" 
                aria-label="settings"
                size="large"
                onClick={handleSettingsOpen}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <SettingsIcon />
              </IconButton>
              
              <IconButton
                color="inherit"
                aria-label="user profile"
                size="large"
                onClick={handleUserMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: '#CC2030'
                  }}
                >
                  JD
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Navigation Drawer */}
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={toggleDrawer}
          variant={isMobile ? "temporary" : "permanent"}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
              border: 'none',
              ...(isMobile ? {} : { position: 'relative' })
            },
            display: isMobile ? 'block' : (openDrawer ? 'block' : 'none')
          }}
        >
          <Toolbar />
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <PCILogo size="small" />
              {isMobile && (
                <IconButton size="small" onClick={toggleDrawer}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
              <FocusFactorySelector compact={true} />
            </Box>
            
            <Box sx={{ p: 2 }}>
              <PhaseManager compact={true} />
            </Box>
            
            <Divider />
            
            <List sx={{ flexGrow: 1 }}>
              <ListItem 
                button 
                selected={currentTab === 'organization'}
                onClick={() => {
                  setCurrentTab('organization');
                  if (isMobile) toggleDrawer();
                }}
                sx={{ 
                  borderRadius: 1, 
                  m: 1, 
                  '&.Mui-selected': {
                    bgcolor: 'rgba(204, 32, 48, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(204, 32, 48, 0.12)'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <BusinessIcon color={currentTab === 'organization' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Organization Chart" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 'roles'}
                onClick={() => {
                  setCurrentTab('roles');
                  if (isMobile) toggleDrawer();
                }}
                sx={{ 
                  borderRadius: 1, 
                  m: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(204, 32, 48, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(204, 32, 48, 0.12)'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AssignmentIcon color={currentTab === 'roles' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Roles & Responsibilities" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 'process'}
                onClick={() => {
                  setCurrentTab('process');
                  if (isMobile) toggleDrawer();
                }}
                sx={{ 
                  borderRadius: 1, 
                  m: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(204, 32, 48, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(204, 32, 48, 0.12)'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AccountTreeIcon color={currentTab === 'process' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Process Flow" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 'dashboard'}
                onClick={() => {
                  setCurrentTab('dashboard');
                  if (isMobile) toggleDrawer();
                }}
                disabled
                sx={{ 
                  borderRadius: 1, 
                  m: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(204, 32, 48, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(204, 32, 48, 0.12)'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 'reports'}
                onClick={() => {
                  setCurrentTab('reports');
                  if (isMobile) toggleDrawer();
                }}
                disabled
                sx={{ 
                  borderRadius: 1, 
                  m: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(204, 32, 48, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(204, 32, 48, 0.12)'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItem>
            </List>
            
            <Divider />
            
            <List>
              <ListItem button sx={{ borderRadius: 1, m: 1 }}>
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItem>
            </List>
            
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              borderTop: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="caption" color="text.secondary" align="center">
                PCI Quality Reorganization Tool
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                Version 2.0
              </Typography>
            </Box>
          </Box>
        </Drawer>
        
        {/* Mobile tab navigation */}
        {isMobile && (
          <Toolbar sx={{ 
            position: 'fixed', 
            width: '100%', 
            top: 64, // Height of AppBar
            bgcolor: 'background.paper',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            px: 1
          }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="mobile navigation tabs"
              sx={{ width: '100%' }}
            >
              <Tab icon={<BusinessIcon />} value="organization" />
              <Tab icon={<AssignmentIcon />} value="roles" />
              <Tab icon={<AccountTreeIcon />} value="process" />
              <Tab icon={<DashboardIcon />} value="dashboard" disabled />
              <Tab icon={<BarChartIcon />} value="reports" disabled />
            </Tabs>
          </Toolbar>
        )}
        
        {/* Main content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: '100%',
            ml: isMobile ? 0 : (openDrawer ? '240px' : 0),
            transition: 'margin 0.2s',
            mt: isMobile ? 12 : 8 // Extra margin for mobile tabs
          }}
        >
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            height: isMobile ? 'calc(100vh - 130px)' : 'calc(100vh - 90px)'
          }}>
            {renderTabContent()}
          </Box>
        </Box>
      </Box>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5, 
            width: 320,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1">Notifications</Typography>
        </Box>
        
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2">Organization Updated</Typography>
              <Chip size="small" label="New" color="primary" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Changes to the ADD org structure have been saved.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              5 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2">New Role Added</Typography>
              <Chip size="small" label="New" color="primary" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              A new role 'Quality Specialist' has been added.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2">Process Flow Updated</Typography>
              <Chip size="small" label="New" color="primary" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              The quality approval process has been updated.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3 hours ago
            </Typography>
          </Box>
        </MenuItem>
        
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button size="small" onClick={handleNotificationsClose}>
            View All Notifications
          </Button>
        </Box>
      </Menu>
      
      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1.5 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          Save Current State
        </MenuItem>
        
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Export Configuration
        </MenuItem>
        
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          Import Configuration
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1.5 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: '#CC2030',
              width: 40, 
              height: 40, 
              mr: 1.5
            }}
          >
            JD
          </Avatar>
          <Box>
            <Typography variant="subtitle1">John Doe</Typography>
            <Typography variant="body2" color="text.secondary">
              Quality Manager
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleUserMenuClose}>My Profile</MenuItem>
        <MenuItem onClick={handleUserMenuClose}>Account Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>Sign Out</MenuItem>
      </Menu>
    </ThemeProvider>
  );
};

// Wrap with Redux Provider
const AppWithProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithProvider;