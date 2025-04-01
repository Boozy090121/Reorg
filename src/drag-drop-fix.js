import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { assignPersonToNode } from '../features/orgChartSlice';
import { updatePersonnelAvailability } from '../features/personnelSlice';

// Enhanced Droppable component for personnel
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
            transition: 'background-color 0.2s ease',
            minHeight: '200px' // Ensure there's always a droppable area
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

// Enhanced DragDropManager with improved handling of personnel drops
const EnhancedDragDropManager = ({ children }) => {
  const dispatch = useDispatch();
  const currentPhase = useSelector(state => state.phase.currentPhase);
  const currentFactory = useSelector(state => state.focusFactory.currentFactory);
  
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If the item was dropped back where it started
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    console.log('Drag end:', { source, destination, draggableId });
    
    // Case: Dragging personnel from personnel list to a role node
    if (
      source.droppableId === 'personnelList' && 
      destination.droppableId.startsWith('role-')
    ) {
      const roleId = destination.droppableId.replace('role-', '');
      
      console.log('Assigning personnel to role:', { personId: draggableId, roleId });
      
      // Find which node contains this role
      const orgChart = useSelector(state => 
        state.orgChart.orgCharts[currentPhase][currentFactory] || { nodes: [] }
      );
      
      // Find the node that contains this role
      let targetNodeId = null;
      orgChart.nodes.forEach(node => {
        if (node.roles && node.roles.includes(roleId)) {
          targetNodeId = node.id;
        }
      });
      
      if (targetNodeId) {
        // Dispatch assign personnel action
        dispatch(assignPersonToNode({
          phase: currentPhase,
          factory: currentFactory,
          nodeId: targetNodeId,
          roleId: roleId,
          personId: draggableId
        }));
        
        // Update personnel availability
        dispatch(updatePersonnelAvailability({
          factory: currentFactory,
          personId: draggableId,
          availability: 'Assigned'
        }));
      }
    }
    
    // Add other drag-drop cases as needed (e.g., role reassignments, etc.)
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  );
};

// Component for a droppable role in the org chart
const DroppableRole = ({ roleId, children }) => {
  return (
    <Droppable droppableId={`role-${roleId}`} type="PERSONNEL">
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            padding: 1,
            minHeight: '50px',
            backgroundColor: snapshot.isDraggingOver ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.03)',
            border: snapshot.isDraggingOver ? '2px dashed #4caf50' : '1px dashed #ddd',
            borderRadius: 1,
            marginTop: 1,
            transition: 'all 0.2s ease',
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

// Update to OrgNode component to use the DroppableRole
const OrgNodeEnhanced = ({ node, roles, personnel, assignments, onRemoveNode }) => {
  // ... existing OrgNode code ...
  
  return (
    <Paper /* ... existing styles ... */>
      {/* ... existing node header ... */}
      
      {/* For each role in the node */}
      {node.roles.map((roleId, index) => {
        const role = roles[roleId];
        const assignedPersonId = assignments[roleId];
        const assignedPerson = assignedPersonId ? personnel[assignedPersonId] : null;
        
        return (
          <Box key={roleId} /* ... existing styles ... */>
            <Typography>{role ? role.title : 'Unknown Role'}</Typography>
            
            {/* Make each role a drop target for personnel */}
            <DroppableRole roleId={roleId}>
              {assignedPerson ? (
                <Chip
                  avatar={<Avatar><PersonIcon /></Avatar>}
                  label={assignedPerson.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                  onDelete={() => handleRemoveAssignment(roleId)}
                />
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Drop personnel here
                </Typography>
              )}
            </DroppableRole>
          </Box>
        );
      })}
    </Paper>
  );
};