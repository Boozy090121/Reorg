import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const OrgNode = ({ node, roles, personnel, assignments }) => {
  // Get assigned roles for this node
  const nodeRoles = node.roles || [];
  
  return (
    <Paper 
      elevation={3}
      className="org-node"
      sx={{
        width: '220px',
        minHeight: '120px',
        m: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f8ff',
        border: '1px solid #c2d2ff',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {`Level ${node.level + 1}`}
      </Typography>
      
      <Divider sx={{ mb: 1 }} />
      
      <Droppable droppableId={`org-node-${node.id}`}>
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              minHeight: '50px',
              p: 1,
              bgcolor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              borderRadius: 1,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: nodeRoles.length ? 'flex-start' : 'center',
              border: snapshot.isDraggingOver ? '1px dashed #1976d2' : '1px dashed transparent',
            }}
          >
            {nodeRoles.length > 0 ? (
              nodeRoles.map((roleId, index) => {
                const role = roles[roleId];
                const assignedPersonId = assignments[roleId];
                const assignedPerson = assignedPersonId ? personnel[assignedPersonId] : null;
                
                return (
                  <Draggable key={roleId} draggableId={roleId} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          width: '100%',
                          mb: 1,
                          p: 1,
                          bgcolor: snapshot.isDragging ? 'rgba(25, 118, 210, 0.12)' : 'white',
                          borderRadius: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {role ? role.title : 'Unknown Role'}
                        </Typography>
                        
                        {/* Personnel assignment area */}
                        <Droppable
                          droppableId={`role-${roleId}`}
                          isDropDisabled={!!assignedPerson}
                        >
                          {(provided, snapshot) => (
                            <Box
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              sx={{
                                mt: 1,
                                p: 0.5,
                                minHeight: '30px',
                                bgcolor: snapshot.isDraggingOver ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                                borderRadius: 1,
                                border: snapshot.isDraggingOver ? '1px dashed #4caf50' : '1px dashed #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: assignedPerson ? 'flex-start' : 'center',
                              }}
                            >
                              {assignedPerson ? (
                                <Chip
                                  avatar={<Avatar><PersonIcon /></Avatar>}
                                  label={assignedPerson.name}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Drop personnel here
                                </Typography>
                              )}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Box>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                Drop roles here
              </Typography>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default OrgNode;
