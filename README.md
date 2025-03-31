# Quality Re-organization Tool Documentation

## Overview
The Quality Re-organization Tool is an interactive, data-driven application for optimizing quality operations through re-organization and focus factory management. It supports a multi-phase approach (current state and future state) and provides a unified interface for managing roles, organizational structure, and personnel assignments.

## Features
- **Phase Management**: Switch between current and future state views
- **Three-Panel Interface**:
  - Left Panel: List of roles with detailed responsibilities
  - Center Panel: Interactive org chart with drag-and-drop functionality
  - Right Panel: Available personnel for role assignment
- **Drag-and-Drop Functionality**: Easily drag roles to the org chart and assign personnel
- **Focus Factory Management**: Templates for ADD, BBV, and SYN factories
- **Data Persistence**: Save configurations locally with export/import functionality
- **Optimized Org Chart**: Zoom, pan, and fullscreen controls for better visualization

## Getting Started

### Installation
1. Ensure you have Node.js installed (v14 or higher)
2. Clone or download the repository
3. Navigate to the project directory
4. Install dependencies:
   ```
   npm install
   ```
5. Start the application:
   ```
   npm start
   ```

### Usage Guide

#### Phase Management
- Use the tabs at the top of the application to switch between "Current State" and "Future State"
- Changes made in one phase do not affect the other phase

#### Focus Factory Selection
- Select the desired focus factory (ADD, BBV, or SYN) using the tabs below the phase selection
- Each factory has its own organization structure and assignments

#### Working with Roles
- The left panel displays available roles with their responsibilities
- Click on a role to view detailed responsibilities
- Drag roles from the left panel to nodes in the org chart

#### Working with the Org Chart
- The center panel displays the organization chart
- Use zoom controls to adjust the view:
  - Zoom in/out buttons
  - Zoom slider
  - "Fit to Screen" button
- Enable pan mode to move the chart around
- Use fullscreen mode for a larger view
- Drag roles between nodes to reorganize

#### Assigning Personnel
- The right panel displays available personnel with their skills
- Use the search box to filter personnel by name or skill
- Drag personnel from the right panel to roles in the org chart

#### Saving and Loading Data
- Data is automatically saved to your browser's local storage
- Use the "Export" button to save your configuration as a JSON file
- Use the "Import" button to load a previously exported configuration

## Technical Details

### Architecture
The application is built using React with a component-based architecture:
- App.js: Main application component with state management
- LeftPanel: Manages roles display and drag sources
- CenterPanel: Displays the org chart with drag targets
- RightPanel: Manages personnel display and drag sources
- OrgChartOptimizer: Handles screen fit optimization
- FocusFactoryTemplates: Manages factory templates
- DataPersistenceUtils: Handles data saving and loading

### Data Model
- Roles: Contains role information and responsibilities
- Personnel: Contains personnel information and skills
- OrgChart: Contains the organization structure for each phase and factory
- Assignments: Maps roles to assigned personnel

### Libraries Used
- React: UI framework
- Material UI: Component library
- react-beautiful-dnd: Drag-and-drop functionality
- localStorage API: Data persistence

## Troubleshooting

### Common Issues
- **Drag and drop not working**: Ensure you're dragging from the correct source to the correct target
- **Changes not saving**: Check if localStorage is enabled in your browser
- **Org chart display issues**: Try using the "Fit to Screen" button or adjust zoom level

### Support
For additional support or to report issues, please contact the development team.
