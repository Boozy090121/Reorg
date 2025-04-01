import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Tooltip, Typography, Paper } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PanToolIcon from '@mui/icons-material/PanTool';

// Enhanced org chart optimization component
const OrgChartOptimizer = ({ children, containerRef }) => {
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);
  
  // Auto-fit calculation on mount and when container size changes
  useEffect(() => {
    const calculateOptimalZoom = () => {
      if (!containerRef.current || !chartRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const chartWidth = chartRef.current.scrollWidth;
      const chartHeight = chartRef.current.scrollHeight;
      
      // Calculate zoom factors for width and height
      const widthZoom = (containerWidth / chartWidth) * 95; // 95% to leave some margin
      const heightZoom = (containerHeight / chartHeight) * 95;
      
      // Use the smaller zoom factor to ensure everything fits
      const optimalZoom = Math.min(widthZoom, heightZoom, 100); // Cap at 100%
      
      setZoom(Math.max(optimalZoom, 50)); // Minimum zoom of 50%
      setPosition({ x: 0, y: 0 }); // Reset position
    };
    
    calculateOptimalZoom();
    
    // Set up resize observer to recalculate when container size changes
    const resizeObserver = new ResizeObserver(calculateOptimalZoom);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);
  
  // Handle zoom change
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };
  
  // Zoom in/out functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };
  
  // Fit to screen function
  const handleFitToScreen = () => {
    if (!containerRef.current || !chartRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const chartWidth = chartRef.current.scrollWidth;
    const chartHeight = chartRef.current.scrollHeight;
    
    const widthZoom = (containerWidth / chartWidth) * 95;
    const heightZoom = (containerHeight / chartHeight) * 95;
    
    const optimalZoom = Math.min(widthZoom, heightZoom, 100);
    
    setZoom(Math.max(optimalZoom, 50));
    setPosition({ x: 0, y: 0 }); // Reset position
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    
    // Reset position when toggling fullscreen
    setPosition({ x: 0, y: 0 });
    
    // Recalculate optimal zoom after a short delay to allow DOM to update
    setTimeout(handleFitToScreen, 100);
  };
  
  // Pan functionality
  const handlePanStart = (e) => {
    if (!isPanning) return;
    
    if (e.type === 'mousedown') {
      setStartPan({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      
      const handleMouseMove = (moveEvent) => {
        setPosition({
          x: moveEvent.clientX - startPan.x,
          y: moveEvent.clientY - startPan.y
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  // Toggle pan mode
  const togglePanMode = () => {
    setIsPanning(prev => !prev);
  };
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: isFullscreen ? '100vh' : '70vh',
        width: isFullscreen ? '100vw' : '100%',
        overflow: 'hidden',
        bgcolor: isFullscreen ? 'background.paper' : 'transparent',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1300,
        })
      }}
      ref={containerRef}
    >
      <Box
        ref={chartRef}
        sx={{
          transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center',
          transition: 'transform 0.1s ease',
          height: '100%',
          width: '100%',
          cursor: isPanning ? 'grab' : 'default',
          '&:active': {
            cursor: isPanning ? 'grabbing' : 'default',
          }
        }}
        onMouseDown={handlePanStart}
      >
        {children}
      </Box>
      
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10,
        }}
      >
        <Tooltip title="Zoom Out">
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        
        <Slider
          value={zoom}
          onChange={handleZoomChange}
          min={50}
          max={200}
          step={5}
          sx={{ width: 100, mx: 1 }}
          aria-label="Zoom"
        />
        
        <Tooltip title="Zoom In">
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Fit to Screen">
          <IconButton onClick={handleFitToScreen} size="small" sx={{ ml: 1 }}>
            <FitScreenIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isPanning ? "Disable Pan" : "Enable Pan"}>
          <IconButton 
            onClick={togglePanMode} 
            size="small" 
            color={isPanning ? "primary" : "default"}
            sx={{ ml: 1 }}
          >
            <PanToolIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={toggleFullscreen} size="small" sx={{ ml: 1 }}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Paper>
      
      {isFullscreen && (
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            p: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            zIndex: 10,
          }}
        >
          <Typography variant="subtitle2">
            Organization Chart - Fullscreen Mode
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrgChartOptimizer;
