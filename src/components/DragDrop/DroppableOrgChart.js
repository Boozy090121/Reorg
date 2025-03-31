import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import OrgChartNode from '../CenterPanel/OrgChartNode';
import OrgChartConnection from '../CenterPanel/OrgChartConnection';

const DroppableOrgChart = ({ phase, factory, zoom, position, dragging, selectedNode, onNodeSelect }) => {
  const orgChart = useSelector(state => 
    state.orgChart.orgCharts[phase]?.[factory] || { nodes: [], connections: [] }
  );
  
  return (
    <Droppable droppableId="orgChart" type="ORG_CHART">
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            transition: dragging ? 'none' : 'transform 0.2s ease-out',
            backgroundColor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
            border: snapshot.isDraggingOver ? '2px dashed rgba(25, 118, 210, 0.3)' : 'none',
            borderRadius: 2
          }}
        >
          {/* Render connections first so they appear behind nodes */}
          {orgChart.connections.map(connection => (
            <OrgChartConnection
              key={`${connection.source}-${connection.target}`}
              sourceId={connection.source}
              targetId={connection.target}
              nodes={orgChart.nodes}
            />
          ))}
          
          {/* Render nodes */}
          {orgChart.nodes.map((node, index) => (
            <Draggable key={node.id} draggableId={node.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    position: 'absolute',
                    top: node.position.y,
                    left: node.position.x,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Droppable droppableId={`role-${node.id}`} type="PERSONNEL">
                    {(providedDrop, snapshotDrop) => (
                      <div
                        ref={providedDrop.innerRef}
                        {...providedDrop.droppableProps}
                      >
                        <OrgChartNode
                          node={node}
                          isSelected={selectedNode === node.id}
                          onSelect={onNodeSelect}
                          isDragging={snapshot.isDragging}
                          isDropTarget={snapshotDrop.isDraggingOver}
                        />
                        {providedDrop.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DroppableOrgChart;
