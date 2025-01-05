import React from 'react';
import { render, screen } from '@testing-library/react';

// Define a simple React component for testing
const ExampleComponent: React.FC = () => <h1>Hello, Testing!</h1>;

test('renders the example component', () => {
  // Render the component
  render(<ExampleComponent />);
  
  // Assert that the text "Hello, Testing!" is in the document
  expect(screen.getByText('Hello, Testing!')).toBeInTheDocument();
});
