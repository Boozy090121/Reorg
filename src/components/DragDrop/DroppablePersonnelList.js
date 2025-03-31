import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';

const DroppablePersonnelList = ({ children }) => {
  return (
    <Droppable droppableId="personnelList" type="PERSONNEL">
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            height: '100%',
            backgroundColor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
            transition: 'background-color 0.2s ease'
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppablePersonnelList;
