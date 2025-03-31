import React from 'react';
import { Tabs, Tab, Box, Typography, Paper, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Science';
import BbvIcon from '@mui/icons-material/LocalDrink';
import SynIcon from '@mui/icons-material/MedicalServices';

// Factory template definitions
const factoryTemplates = {
  ADD: {
    name: 'Advanced Drug Delivery',
    description: 'Focuses on innovative drug delivery systems and technologies',
    icon: <AddIcon />,
    defaultStructure: {
      levels: 3,
      nodesPerLevel: [1, 2, 3],
      recommendedRoles: [
        'Quality Manager',
        'Drug Delivery Specialist',
        'Formulation Scientist',
        'Regulatory Affairs Specialist',
        'Quality Control Analyst'
      ]
    }
  },
  BBV: {
    name: 'Bottles, Blisters, Vials',
    description: 'Specializes in container and packaging quality management',
    icon: <BbvIcon />,
    defaultStructure: {
      levels: 3,
      nodesPerLevel: [1, 2, 2],
      recommendedRoles: [
        'Packaging Manager',
        'Container Quality Specialist',
        'Materials Analyst',
        'Sterility Assurance Specialist',
        'Visual Inspection Lead'
      ]
    }
  },
  SYN: {
    name: 'Syringes & Sterilization',
    description: 'Focuses on syringe production and sterilization processes',
    icon: <SynIcon />,
    defaultStructure: {
      levels: 3,
      nodesPerLevel: [1, 2, 2],
      recommendedRoles: [
        'Sterilization Manager',
        'Syringe Production Specialist',
        'Aseptic Processing Expert',
        'Validation Engineer',
        'Quality Assurance Specialist'
      ]
    }
  }
};

// Factory template component
const FocusFactoryTemplate = ({ factory, onSelect }) => {
  const template = factoryTemplates[factory];
  
  if (!template) {
    return <Typography color="error">Unknown factory type</Typography>;
  }
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onSelect(factory)}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1} color="primary.main">
          {template.icon}
        </Box>
        <Typography variant="h6">{template.name}</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {template.description}
      </Typography>
      
      <Divider sx={{ my: 1 }} />
      
      <Typography variant="subtitle2">Structure:</Typography>
      <Typography variant="body2">
        {template.defaultStructure.levels} levels with {template.defaultStructure.nodesPerLevel.join('/')} nodes per level
      </Typography>
      
      <Typography variant="subtitle2" sx={{ mt: 1 }}>Recommended Roles:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
        {template.defaultStructure.recommendedRoles.map((role, index) => (
          <Typography key={index} variant="body2" sx={{ 
            bgcolor: 'background.paper', 
            px: 1, 
            py: 0.5, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            {role}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

// Focus Factory selector component
const FocusFactorySelector = ({ currentFactory, onFactoryChange }) => {
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Tabs
        value={currentFactory}
        onChange={(e, newValue) => onFactoryChange(newValue)}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab 
          value="ADD" 
          label="ADD" 
          icon={factoryTemplates.ADD.icon} 
          iconPosition="start"
        />
        <Tab 
          value="BBV" 
          label="BBV" 
          icon={factoryTemplates.BBV.icon} 
          iconPosition="start"
        />
        <Tab 
          value="SYN" 
          label="SYN" 
          icon={factoryTemplates.SYN.icon} 
          iconPosition="start"
        />
      </Tabs>
      
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mt: 1 }}>
        <Typography variant="subtitle1">
          {factoryTemplates[currentFactory].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {factoryTemplates[currentFactory].description}
        </Typography>
      </Box>
    </Box>
  );
};

// Factory template generator
const generateFactoryTemplate = (factory) => {
  const template = factoryTemplates[factory];
  if (!template) return null;
  
  const { levels, nodesPerLevel } = template.defaultStructure;
  
  // Generate nodes based on template structure
  const nodes = [];
  let nodeId = 1;
  
  for (let level = 0; level < levels; level++) {
    const nodesInLevel = nodesPerLevel[level] || 1;
    
    for (let i = 0; i < nodesInLevel; i++) {
      nodes.push({
        id: `node-${nodeId}`,
        level,
        roles: []
      });
      nodeId++;
    }
  }
  
  return {
    nodes
  };
};

export { 
  FocusFactoryTemplate, 
  FocusFactorySelector, 
  factoryTemplates, 
  generateFactoryTemplate 
};
