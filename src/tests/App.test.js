import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';

// Mock the store
const mockStore = configureStore([]);

// Mock the theme to avoid breakpoints issues in tests
jest.mock('../theme', () => ({
  breakpoints: {
    down: () => false,
  },
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    focusFactory: {
      ADD: '#4caf50',
      BBV: '#2196f3',
      SYN: '#ff9800',
    },
  },
}));

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      phase: {
        currentPhase: 'current',
        phases: ['current', 'future', 'iterative'],
      },
      focusFactory: {
        currentFactory: 'ADD',
        factories: ['ADD', 'BBV', 'SYN'],
      },
      roles: {
        roles: {
          ADD: [],
          BBV: [],
          SYN: [],
        },
      },
      personnel: {
        personnel: {
          ADD: [],
          BBV: [],
          SYN: [],
        },
      },
      orgChart: {
        orgCharts: {
          current: {
            ADD: { nodes: [], connections: [] },
            BBV: { nodes: [], connections: [] },
            SYN: { nodes: [], connections: [] },
          },
          future: {
            ADD: { nodes: [], connections: [] },
            BBV: { nodes: [], connections: [] },
            SYN: { nodes: [], connections: [] },
          },
          iterative: {
            ADD: { nodes: [], connections: [] },
            BBV: { nodes: [], connections: [] },
            SYN: { nodes: [], connections: [] },
          },
        },
      },
      persistence: {
        lastSaved: null,
        autoSaveEnabled: true,
        autoSaveInterval: 60000,
        saveInProgress: false,
        saveError: null,
        loadError: null,
      },
    });

    // Mock dispatch function
    store.dispatch = jest.fn();
  });

  test('renders application title', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    expect(screen.getByText('Quality Re-organization Tool')).toBeInTheDocument();
  });

  test('loads saved state on startup', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Check if loadAppState was dispatched
    expect(store.dispatch).toHaveBeenCalled();
  });

  // Add more tests as needed
});
