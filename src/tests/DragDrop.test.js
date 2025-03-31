import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DragDropContext } from 'react-beautiful-dnd';
import DragDropManager from '../components/DragDrop/DragDropManager';
import DroppableRolesList from '../components/DragDrop/DroppableRolesList';
import DroppablePersonnelList from '../components/DragDrop/DroppablePersonnelList';

// Mock the store
const mockStore = configureStore([]);

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context">{children}</div>
  ),
  Droppable: ({ children }) => children({
    droppableProps: {
      'data-testid': 'droppable'
    },
    innerRef: jest.fn(),
    placeholder: null
  }),
  Draggable: ({ children }) => children({
    draggableProps: {
      'data-testid': 'draggable'
    },
    innerRef: jest.fn(),
    dragHandleProps: {}
  }),
}));

describe('Drag and Drop Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      roles: {
        roles: {
          ADD: [
            { id: 'role1', title: 'Quality Manager', responsibilities: ['Manage quality processes'] }
          ]
        }
      },
      personnel: {
        personnel: {
          ADD: [
            { id: 'person1', name: 'John Doe', skills: ['Quality Management'] }
          ]
        }
      },
      phase: {
        currentPhase: 'current'
      },
      focusFactory: {
        currentFactory: 'ADD'
      }
    });

    // Mock dispatch function
    store.dispatch = jest.fn();
  });

  test('DragDropManager renders children', () => {
    render(
      <Provider store={store}>
        <DragDropManager>
          <div data-testid="child-component">Test Child</div>
        </DragDropManager>
      </Provider>
    );
    
    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('DroppableRolesList renders children', () => {
    render(
      <Provider store={store}>
        <DragDropManager>
          <DroppableRolesList>
            <div data-testid="roles-content">Roles Content</div>
          </DroppableRolesList>
        </DragDropManager>
      </Provider>
    );
    
    expect(screen.getByTestId('roles-content')).toBeInTheDocument();
    expect(screen.getByText('Roles Content')).toBeInTheDocument();
  });

  test('DroppablePersonnelList renders children', () => {
    render(
      <Provider store={store}>
        <DragDropManager>
          <DroppablePersonnelList>
            <div data-testid="personnel-content">Personnel Content</div>
          </DroppablePersonnelList>
        </DragDropManager>
      </Provider>
    );
    
    expect(screen.getByTestId('personnel-content')).toBeInTheDocument();
    expect(screen.getByText('Personnel Content')).toBeInTheDocument();
  });

  // Add more tests for drag and drop functionality
});
