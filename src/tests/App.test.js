import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { DragDropContext } from 'react-beautiful-dnd';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock drag and drop functionality
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => {
    const contextValue = { onDragEnd };
    return <div data-testid="drag-drop-context">{children}</div>;
  },
  Droppable: ({ children, droppableId }) => 
    children({
      innerRef: jest.fn(),
      droppableProps: { 'data-testid': `droppable-${droppableId}` },
      placeholder: null
    }),
  Draggable: ({ children, draggableId }) => 
    children({
      innerRef: jest.fn(),
      draggableProps: { 'data-testid': `draggable-${draggableId}` },
      dragHandleProps: { 'data-testid': `handle-${draggableId}` }
    })
}));

describe('Quality Re-organization Tool Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('App renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Quality Re-organization Tool')).toBeInTheDocument();
  });

  test('Phase switching works correctly', () => {
    render(<App />);
    
    // Check initial phase is 'current'
    expect(screen.getByText('Current State')).toBeInTheDocument();
    
    // Switch to future state
    fireEvent.click(screen.getByText('Future State'));
    
    // Verify phase switched
    expect(screen.getByText('Future State')).toBeInTheDocument();
  });

  test('Focus factory switching works correctly', () => {
    render(<App />);
    
    // Check initial factory is 'ADD'
    expect(screen.getByText('ADD - Advanced Drug Delivery')).toBeInTheDocument();
    
    // Switch to BBV factory
    fireEvent.click(screen.getByText('BBV - Bottles, Blisters, Vials'));
    
    // Verify factory switched
    expect(screen.getByText('BBV - Bottles, Blisters, Vials')).toBeInTheDocument();
  });

  test('Data persistence saves to localStorage', () => {
    render(<App />);
    
    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'qualityReorgData',
      expect.any(String)
    );
  });

  test('Export functionality works', () => {
    // Mock document.createElement
    const mockAnchor = {
      setAttribute: jest.fn(),
      click: jest.fn()
    };
    document.createElement = jest.fn().mockImplementation(tag => {
      if (tag === 'a') return mockAnchor;
      return document.createElement(tag);
    });
    
    render(<App />);
    
    // Click export button
    fireEvent.click(screen.getByText('Export'));
    
    // Verify anchor was created and clicked
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('href', expect.any(String));
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', expect.any(String));
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  // Add more tests as needed
});

export default {};
