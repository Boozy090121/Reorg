import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

// Import your store
import store from './store';

// Import components
import FlexibleLayout from './components/FlexibleLayout';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import RolesAndResponsibilities from './components/RolesAndResponsibilities';
import QualityProcessFlow from './components/QualityProcessFlow';
import FocusFactorySelector from './components/FocusFactory/FocusFactorySelector';
import PhaseManager from './components/PhaseManager/PhaseManager';
import { EnhancedDragDropProvider } from './utils/DragDropUtils';
import PersistenceManager from './components/Persistence/PersistenceManager';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
    // Colors for focus factories
    focusFactory: {
      ADD: '#4caf50', // Green
      BBV: '#2196f3', // Blue
      SYN: '#ff9800', // Orange
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '0.4em',
            height: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

// Main App component
function App() {
  // State for navigation and UI
  const [currentTab, setCurrentTab] = useState('organization');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  
  // Load data from local storage, if available
  useEffect(() => {
    // Your existing code to load saved data
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Handle menu open
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'organization':
        return (
          <EnhancedDragDropProvider>
            <FlexibleLayout
              leftPanel={<LeftPanel />}
              centerPanel={<CenterPanel />}
              rightPanel={<RightPanel />}
            />
          </EnhancedDragDropProvider>
        );
      case 'roles':
        return <RolesAndResponsibilities />;
      case 'process':
        return <QualityProcessFlow />;
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* App Bar */}
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Quality Re-organization Tool
              </Typography>
              
              <Button color="inherit" startIcon={<SaveIcon />}>
                Save
              </Button>
              
              <Button color="inherit" startIcon={<DownloadIcon />}>
                Export
              </Button>
              
              <label htmlFor="upload-file">
                <Button 
                  color="inherit" 
                  component="span" 
                  startIcon={<UploadIcon />}
                >
                  Import
                </Button>
              </label>
              <input 
                id="upload-file" 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }}
              />
              
              <IconButton
                color="inherit"
                aria-label="settings"
                onClick={handleMenuClick}
              >
                <SettingsIcon />
              </IconButton>
              
              <IconButton color="inherit" aria-label="help">
                <HelpIcon />
              </IconButton>
              
              <IconButton color="inherit" aria-label="account">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <MenuItem onClick={handleMenuClose}>User Preferences</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>Reset Data</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          
          {/* Navigation Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Quality Re-org Tool
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Version 2.0
                </Typography>
              </Box>
              <Divider />
              <List>
                <ListItem 
                  button 
                  selected={currentTab === 'organization'}
                  onClick={() => setCurrentTab('organization')}
                >
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Organization Chart" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 'roles'}
                  onClick={() => setCurrentTab('roles')}
                >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Roles & Responsibilities" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 'process'}
                  onClick={() => setCurrentTab('process')}
                >
                  <ListItemIcon>
                    <AccountTreeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Process Flow" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 'dashboard'}
                  onClick={() => setCurrentTab('dashboard')}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 'reports'}
                  onClick={() => setCurrentTab('reports')}
                >
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help & Documentation" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          
          {/* Phase and Factory Selection */}
          <Box sx={{ bgcolor: '#f0f0f0', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4 }}>
                <PhaseManager />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FocusFactorySelector />
              </Box>
            </Box>
          </Box>
          
          {/* Main Content Tabs */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                aria-label="main navigation tabs"
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
            </Box>
            
            {/* Main Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {renderTabContent()}
            </Box>
          </Box>
          
          {/* Footer */}
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: '#f0f0f0',
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Quality Re-organization Tool | Version 2.0
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Last saved: 2 mins ago
              </Typography>
              <Button size="small" startIcon={<SaveIcon />}>
                Save Now
              </Button>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;