import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { addNode, updateNode, assignPersonToNode } from '../../features/orgChartSlice';
import { updatePersonnelAvailability } from '../../features/personnelSlice';

const DragDropManager = ({ children }) => {
  const dispatch = useDispatch();
  const currentPhase = useSelector(state => state.phase.currentPhase);
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  const roles = useSelector(state => state.roles.roles[currentFactory] || []);
  const orgChart = useSelector(state => 
    state.orgChart.orgCharts[currentPhase]?.[currentFactory] || { nodes: [], connections: [] }
  );
  
  // Handle drag end event
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area or dropped in same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
    
    // Case 1: Dragging a role from left panel to org chart
    if (source.droppableId === 'rolesList' && destination.droppableId === 'orgChart') {
      handleRoleDragToOrgChart(draggableId, destination, roles);
    }
    
    // Case 2: Dragging a person from right panel to a role in org chart
    if (source.droppableId === 'personnelList' && destination.droppableId.startsWith('role-')) {
      const nodeId = destination.droppableId.replace('role-', '');
      handlePersonnelDragToRole(draggableId, nodeId, orgChart);
    }
    
    // Case 3: Rearranging nodes within org chart
    if (source.droppableId === 'orgChart' && destination.droppableId === 'orgChart') {
      handleNodeRearrangement(draggableId, destination, orgChart);
    }
  };
  
  // Handle dragging a role from left panel to org chart
  const handleRoleDragToOrgChart = (roleId, destination, roles) => {
    // Get the role data
    const role = roles.find(r => r.id === roleId);
    
    if (!role) return;
    
    // Create a new node in the org chart
    const newNode = {
      id: `${currentFactory.toLowerCase()}-${roleId}-${Date.now()}`,
      roleId: roleId,
      title: role.title,
      personId: null,
      parentId: null, // Will be set based on drop position
      position: {
        x: destination.x || 400, // Default position if not specified
        y: destination.y || 200
      }
    };
    
    // Dispatch action to add the node
    dispatch(addNode({
      phase: currentPhase,
      factory: currentFactory,
      node: newNode
    }));
  };
  
  // Handle dragging a person from right panel to a role in org chart
  const handlePersonnelDragToRole = (personId, nodeId, orgChart) => {
    // Get the current node and person data
    const node = orgChart.nodes.find(n => n.id === nodeId);
    
    if (!node) return;
    
    // Assign the person to the node
    dispatch(assignPersonToNode({
      phase: currentPhase,
      factory: currentFactory,
      nodeId: nodeId,
      personId: personId
    }));
    
    // Update the person's availability
    dispatch(updatePersonnelAvailability({
      factory: currentFactory,
      personId: personId,
      availability: 'Assigned'
    }));
  };
  
  // Handle rearranging nodes within org chart
  const handleNodeRearrangement = (nodeId, destination, orgChart) => {
    // Get the current org chart data
    const node = orgChart.nodes.find(n => n.id === nodeId);
    
    if (!node) return;
    
    // Update the node's position
    dispatch(updateNode({
      phase: currentPhase,
      factory: currentFactory,
      nodeId: nodeId,
      updatedNode: {
        position: {
          x: destination.x || node.position.x,
          y: destination.y || node.position.y
        }
      }
    }));
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DragDropManager;
