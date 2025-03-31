import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, List, ListItem, ListItemText, Divider, Chip, Box, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const LeftPanel = ({ roles, className }) => {
  const [expandedRoles, setExpandedRoles] = React.useState({});

  const toggleRoleExpand = (roleId) => {
    setExpandedRoles({
      ...expandedRoles,
      [roleId]: !expandedRoles[roleId]
    });
  };

  return (
    <div className={className}>
      <Typography variant="h6" className="panel-title">
        Roles & Responsibilities
      </Typography>
      
      <Droppable droppableId="roles-list" isDropDisabled={true}>
        {(provided, snapshot) => (
          <List
            {...provided.droppableProps}
            ref={provided.innerRef}
            component={Paper}
            elevation={1}
            sx={{ 
              bgcolor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
              minHeight: '100px'
            }}
          >
            {Object.values(roles).map((role, index) => (
              <Draggable key={role.id} draggableId={role.id} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: snapshot.isDragging ? 'rgba(25, 118, 210, 0.12)' : 'white',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                    button
                    onClick={() => toggleRoleExpand(role.id)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" component="span">
                            {role.title}
                          </Typography>
                          {expandedRoles[role.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Box>
                      }
                    />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {Object.values(roles).length === 0 && (
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No roles available
                </Typography>
              </ListItem>
            )}
          </List>
        )}
      </Droppable>

      {/* Expanded role details */}
      {Object.values(roles).map((role) => (
        <Collapse key={`details-${role.id}`} in={expandedRoles[role.id]} timeout="auto" unmountOnExit>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
            <Typography variant="subtitle2" gutterBottom>
              Responsibilities:
            </Typography>
            <List dense>
              {role.responsibilities.map((resp, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <Chip 
                    label={resp} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'white',
                      border: '1px solid rgba(25, 118, 210, 0.2)'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              Drag this role to the organization chart to assign it.
            </Typography>
          </Paper>
        </Collapse>
      ))}
    </div>
  );
};

export default LeftPanel;
