import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Typography, Paper } from '@mui/material';

// Enhanced drag-and-drop helper component for visual feedback
const DragDropHelper = () => {
  return (
    <div className="drag-drop-helper">
      <Paper 
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          padding: '10px 15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          borderLeft: '4px solid #1976d2',
          maxWidth: '300px'
        }}
      >
        <Typography variant="subtitle2" gutterBottom>Drag & Drop Tips:</Typography>
        <Typography variant="body2">• Drag roles from left panel to org chart</Typography>
        <Typography variant="body2">• Drag personnel from right panel to roles</Typography>
        <Typography variant="body2">• Rearrange roles within the org chart</Typography>
      </Paper>
    </div>
  );
};

// Custom drag layer for improved visual feedback during dragging
const CustomDragLayer = ({ isDragging, item, type }) => {
  if (!isDragging) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '200px',
          padding: '10px',
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
          borderRadius: '4px',
          color: 'white',
          boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="body2">
          {type === 'role' ? 'Moving Role' : 'Assigning Personnel'}
        </Typography>
      </div>
    </div>
  );
};

// Enhanced drag-and-drop context provider with improved error handling and visual feedback
const EnhancedDragDropProvider = ({ children, onDragEnd }) => {
  const [dragState, setDragState] = React.useState({
    isDragging: false,
    item: null,
    type: null
  });

  const handleDragStart = (start) => {
    const type = start.source.droppableId.includes('roles') ? 'role' : 'personnel';
    setDragState({
      isDragging: true,
      item: start.draggableId,
      type
    });
  };

  const handleDragEnd = (result) => {
    setDragState({
      isDragging: false,
      item: null,
      type: null
    });
    
    // Call the provided onDragEnd handler
    onDragEnd(result);
  };

  return (
    <>
      <DragDropContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DragDropContext>
      <CustomDragLayer {...dragState} />
      <DragDropHelper />
    </>
  );
};

export { EnhancedDragDropProvider };
