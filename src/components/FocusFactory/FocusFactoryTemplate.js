import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FocusFactoryTemplate = ({ factory }) => {
  // Get template data based on factory
  const getTemplateData = () => {
    switch(factory) {
      case 'ADD':
        return {
          title: 'Advanced Drug Delivery',
          description: 'Focus factory specializing in innovative drug delivery systems including inhalers, auto-injectors, and transdermal patches.',
          color: '#4caf50',
          departments: [
            {
              name: 'R&D',
              roles: ['Research Scientist', 'Development Engineer', 'Clinical Trial Coordinator']
            },
            {
              name: 'Manufacturing',
              roles: ['Production Manager', 'Process Engineer', 'Quality Control Specialist']
            },
            {
              name: 'Quality Assurance',
              roles: ['QA Manager', 'Validation Specialist', 'Compliance Officer']
            },
            {
              name: 'Regulatory Affairs',
              roles: ['Regulatory Affairs Manager', 'Documentation Specialist', 'Submission Coordinator']
            }
          ],
          keyMetrics: [
            'First-time pass rate',
            'Defect rate per million',
            'Regulatory submission success rate',
            'Time-to-market for new delivery systems'
          ]
        };
      case 'BBV':
        return {
          title: 'Bottles, Blisters, Vials',
          description: 'Focus factory specializing in primary packaging solutions including glass and plastic containers, blister packs, and vials.',
          color: '#2196f3',
          departments: [
            {
              name: 'Design',
              roles: ['Packaging Designer', 'Materials Specialist', 'CAD Engineer']
            },
            {
              name: 'Production',
              roles: ['Production Supervisor', 'Line Operator', 'Maintenance Technician']
            },
            {
              name: 'Quality Control',
              roles: ['QC Inspector', 'Test Engineer', 'Calibration Specialist']
            },
            {
              name: 'Supply Chain',
              roles: ['Supply Chain Manager', 'Inventory Controller', 'Logistics Coordinator']
            }
          ],
          keyMetrics: [
            'Container integrity failure rate',
            'Production line efficiency',
            'Material waste percentage',
            'On-time delivery performance'
          ]
        };
      case 'SYN':
        return {
          title: 'Syringes & Sterilization',
          description: 'Focus factory concentrating on sterile delivery systems including prefilled syringes, needles, and sterilization processes.',
          color: '#ff9800',
          departments: [
            {
              name: 'Sterile Manufacturing',
              roles: ['Sterile Processing Manager', 'Clean Room Supervisor', 'Aseptic Filling Operator']
            },
            {
              name: 'Sterilization',
              roles: ['Sterilization Engineer', 'Validation Specialist', 'Equipment Technician']
            },
            {
              name: 'Microbiology',
              roles: ['Microbiologist', 'Lab Technician', 'Environmental Monitoring Specialist']
            },
            {
              name: 'Quality Systems',
              roles: ['Quality Systems Manager', 'CAPA Coordinator', 'Audit Specialist']
            }
          ],
          keyMetrics: [
            'Sterility assurance level',
            'Particulate contamination rate',
            'Endotoxin test pass rate',
            'Batch rejection rate'
          ]
        };
      default:
        return {
          title: 'Unknown Factory',
          description: 'No template available for this focus factory.',
          color: '#9e9e9e',
          departments: [],
          keyMetrics: []
        };
    }
  };
  
  const templateData = getTemplateData();
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box 
          sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            bgcolor: templateData.color,
            mr: 1
          }} 
        />
        <Typography variant="h6">{templateData.title}</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {templateData.description}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Organizational Structure
      </Typography>
      
      {templateData.departments.map((dept, index) => (
        <Accordion key={index} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{dept.name} Department</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {dept.roles.map((role, roleIndex) => (
                <ListItem key={roleIndex} disablePadding>
                  <ListItemText primary={`• ${role}`} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Key Performance Metrics
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {templateData.keyMetrics.map((metric, index) => (
            <Chip 
              key={index} 
              label={metric} 
              variant="outlined" 
              size="small"
              sx={{ borderColor: templateData.color }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default FocusFactoryTemplate;
