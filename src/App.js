import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

// Import custom theme
import theme from './theme';

// Import panels and components
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import FocusFactorySelector from './components/FocusFactory/FocusFactorySelector';
import FocusFactoryManager from './components/FocusFactory/FocusFactoryManager';
import PhaseManagementContainer from './components/PhaseManager';
import PersistenceManager from './components/Persistence/PersistenceManager';

// Import drag and drop components
import DragDropManager from './components/DragDrop/DragDropManager';
import DroppableRolesList from './components/DragDrop/DroppableRolesList';
import DroppablePersonnelList from './components/DragDrop/DroppablePersonnelList';
import DroppableOrgChart from './components/DragDrop/DroppableOrgChart';

// Import persistence actions
import { loadAppState } from './features/persistenceSlice';

function App() {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const currentPhase = useSelector(state => state.phase.currentPhase);
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);

  // Responsive design state
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState('center');

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle panel selection on mobile
  const handlePanelSelect = (panel) => {
    setActivePanel(panel);
    setMobileOpen(false);
  };

  // Load saved state on application startup
  useEffect(() => {
    dispatch(loadAppState());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DragDropManager>
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Quality Re-organization Tool
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Phase Management */}
          <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
            <PhaseManagementContainer phase={currentPhase} factory={currentFactory} />
          </Box>
          
          {/* Persistence Management */}
          <Box sx={{ px: 1, bgcolor: 'background.paper' }}>
            <PersistenceManager />
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {isMobile ? (
              // Mobile layout
              <>
                <Drawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                  }}
                  sx={{
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Panels
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box 
                        onClick={() => handlePanelSelect('left')}
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: activePanel === 'left' ? 'primary.light' : 'background.default',
                          color: activePanel === 'left' ? 'primary.contrastText' : 'text.primary',
                          cursor: 'pointer'
                        }}
                      >
                        Roles & Responsibilities
                      </Box>
                      <Box 
                        onClick={() => handlePanelSelect('center')}
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: activePanel === 'center' ? 'primary.light' : 'background.default',
                          color: activePanel === 'center' ? 'primary.contrastText' : 'text.primary',
                          cursor: 'pointer'
                        }}
                      >
                        Organization Chart
                      </Box>
                      <Box 
                        onClick={() => handlePanelSelect('right')}
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: activePanel === 'right' ? 'primary.light' : 'background.default',
                          color: activePanel === 'right' ? 'primary.contrastText' : 'text.primary',
                          cursor: 'pointer'
                        }}
                      >
                        Personnel
                      </Box>
                    </Box>
                  </Box>
                </Drawer>

                <Box sx={{ height: '100%', p: 1 }}>
                  {activePanel === 'left' && (
                    <DroppableRolesList>
                      <LeftPanel phase={currentPhase} factory={currentFactory} />
                    </DroppableRolesList>
                  )}
                  {activePanel === 'center' && (
                    <CenterPanel phase={currentPhase} factory={currentFactory} />
                  )}
                  {activePanel === 'right' && (
                    <DroppablePersonnelList>
                      <RightPanel phase={currentPhase} factory={currentFactory} />
                    </DroppablePersonnelList>
                  )}
                </Box>
              </>
            ) : (
              // Desktop layout
              <Grid container spacing={1} sx={{ height: '100%' }}>
                {/* Left Panel - Roles */}
                <Grid item xs={3}>
                  <DroppableRolesList>
                    <LeftPanel phase={currentPhase} factory={currentFactory} />
                  </DroppableRolesList>
                </Grid>
                
                {/* Center Panel - Org Chart */}
                <Grid item xs={6}>
                  <CenterPanel phase={currentPhase} factory={currentFactory} />
                </Grid>
                
                {/* Right Panel - Personnel */}
                <Grid item xs={3}>
                  <DroppablePersonnelList>
                    <RightPanel phase={currentPhase} factory={currentFactory} />
                  </DroppablePersonnelList>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Footer with Focus Factory Selection */}
          <Box sx={{ p: 1, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <FocusFactorySelector />
            <FocusFactoryManager />
          </Box>
        </Box>
      </DragDropManager>
    </ThemeProvider>
  );
}

export default App;
