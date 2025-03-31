import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { AnimatedBox, TransitionContainer } from '../components/UI/Animations';
import { 
  SectionHeader, 
  SectionSubheader, 
  ContentCard, 
  StatusBadge,
  FocusFactoryBadge 
} from '../components/UI/StyledComponents';

// Mock the store
const mockStore = configureStore([]);

describe('UI Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('SectionHeader renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <SectionHeader>Test Header</SectionHeader>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('SectionSubheader renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <SectionSubheader>Test Subheader</SectionSubheader>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Subheader')).toBeInTheDocument();
  });

  test('ContentCard renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <ContentCard>Card Content</ContentCard>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('StatusBadge renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <StatusBadge status="active" />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('FocusFactoryBadge renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <FocusFactoryBadge factory="ADD" />
      </ThemeProvider>
    );
    
    expect(screen.getByText('ADD')).toBeInTheDocument();
  });

  test('TransitionContainer renders children when in prop is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <TransitionContainer in={true}>
          <div>Transition Content</div>
        </TransitionContainer>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Transition Content')).toBeInTheDocument();
  });

  // AnimatedBox is harder to test as it relies on CSS animations
  test('AnimatedBox renders children', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimatedBox>
          <div>Animated Content</div>
        </AnimatedBox>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Animated Content')).toBeInTheDocument();
  });
});
