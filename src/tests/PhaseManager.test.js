import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PhaseManagementContainer from '../components/PhaseManager';

// Mock the store
const mockStore = configureStore([]);

describe('PhaseManagementContainer Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      phase: {
        currentPhase: 'current',
        phases: ['current', 'future', 'iterative'],
      },
      focusFactory: {
        currentFactory: 'ADD',
      },
      orgChart: {
        orgCharts: {
          current: {
            ADD: { nodes: [], connections: [] },
          },
          future: {
            ADD: { nodes: [], connections: [] },
          },
          iterative: {
            ADD: { nodes: [], connections: [] },
          },
        },
      },
    });

    // Mock dispatch function
    store.dispatch = jest.fn();
  });

  test('renders phase tabs correctly', () => {
    render(
      <Provider store={store}>
        <PhaseManagementContainer phase="current" factory="ADD" />
      </Provider>
    );
    
    expect(screen.getByText('Current State')).toBeInTheDocument();
    expect(screen.getByText('Future State')).toBeInTheDocument();
    expect(screen.getByText('Iterative Phase')).toBeInTheDocument();
  });

  test('highlights current phase tab', () => {
    render(
      <Provider store={store}>
        <PhaseManagementContainer phase="current" factory="ADD" />
      </Provider>
    );
    
    // This test would need to be adapted based on how you're styling the active tab
    // For example, if active tabs have a specific class or attribute
    const currentTab = screen.getByText('Current State').closest('button');
    expect(currentTab).toHaveAttribute('aria-selected', 'true');
  });

  // Add more tests as needed
});
