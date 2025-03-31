import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersistenceManager from '../components/Persistence/PersistenceManager';
import ExportImportManager from '../components/Persistence/ExportImportManager';

// Mock the store
const mockStore = configureStore([]);

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('Persistence Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      persistence: {
        lastSaved: '2025-03-31T14:00:00.000Z',
        autoSaveEnabled: true,
        autoSaveInterval: 60000,
        saveInProgress: false,
        saveError: null,
        loadError: null,
      },
      phase: {
        currentPhase: 'current',
      },
      focusFactory: {
        currentFactory: 'ADD',
      },
      roles: {
        roles: {
          ADD: [],
        },
      },
      personnel: {
        personnel: {
          ADD: [],
        },
      },
      orgChart: {
        orgCharts: {
          current: {
            ADD: { nodes: [], connections: [] },
          },
        },
      },
    });

    // Mock dispatch function
    store.dispatch = jest.fn();
  });

  test('PersistenceManager renders correctly', () => {
    render(
      <Provider store={store}>
        <PersistenceManager />
      </Provider>
    );
    
    expect(screen.getByText('Data Persistence')).toBeInTheDocument();
    expect(screen.getByText(/Last saved:/)).toBeInTheDocument();
    expect(screen.getByText('Auto-save')).toBeInTheDocument();
    expect(screen.getByText('Export/Import Configuration')).toBeInTheDocument();
  });

  test('Auto-save toggle works', () => {
    render(
      <Provider store={store}>
        <PersistenceManager />
      </Provider>
    );
    
    const autoSaveSwitch = screen.getByRole('checkbox');
    expect(autoSaveSwitch).toBeChecked();
    
    fireEvent.click(autoSaveSwitch);
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('Save button works', () => {
    render(
      <Provider store={store}>
        <PersistenceManager />
      </Provider>
    );
    
    const saveButton = screen.getByRole('button', { name: /save now/i });
    fireEvent.click(saveButton);
    
    expect(store.dispatch).toHaveBeenCalled();
  });

  // Add more tests for ExportImportManager as needed
});
