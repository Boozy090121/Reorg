import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FocusFactorySelector from '../components/FocusFactory/FocusFactorySelector';
import FocusFactoryManager from '../components/FocusFactory/FocusFactoryManager';

// Mock the store
const mockStore = configureStore([]);

describe('Focus Factory Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      focusFactory: {
        currentFactory: 'ADD',
        factories: ['ADD', 'BBV', 'SYN'],
        templates: {
          ADD: {
            name: 'Advanced Drug Delivery',
            description: 'Focuses on innovative drug delivery systems',
            departments: ['Quality Control', 'Quality Assurance', 'Validation']
          },
          BBV: {
            name: 'Bottles, Blisters, Vials',
            description: 'Specializes in primary packaging solutions',
            departments: ['Quality Control', 'Quality Assurance', 'Validation']
          },
          SYN: {
            name: 'Syringes & Sterilization',
            description: 'Concentrates on sterile delivery systems',
            departments: ['Quality Control', 'Quality Assurance', 'Validation']
          }
        }
      }
    });

    // Mock dispatch function
    store.dispatch = jest.fn();
  });

  test('FocusFactorySelector renders factory tabs', () => {
    render(
      <Provider store={store}>
        <FocusFactorySelector />
      </Provider>
    );
    
    expect(screen.getByText('ADD')).toBeInTheDocument();
    expect(screen.getByText('BBV')).toBeInTheDocument();
    expect(screen.getByText('SYN')).toBeInTheDocument();
  });

  test('FocusFactorySelector highlights current factory', () => {
    render(
      <Provider store={store}>
        <FocusFactorySelector />
      </Provider>
    );
    
    // This test would need to be adapted based on how you're styling the active tab
    const addTab = screen.getByText('ADD').closest('button');
    expect(addTab).toHaveAttribute('aria-selected', 'true');
  });

  test('FocusFactoryManager renders correctly', () => {
    render(
      <Provider store={store}>
        <FocusFactoryManager />
      </Provider>
    );
    
    // Check for the button that opens the manager dialog
    const managerButton = screen.getByRole('button');
    expect(managerButton).toBeInTheDocument();
  });

  // Add more tests for factory selection and template management
});
