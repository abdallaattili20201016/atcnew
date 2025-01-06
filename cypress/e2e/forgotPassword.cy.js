describe('Forgot Password Page', () => {
    it('should load the Forgot Password page', () => {
      cy.visit('/forgot-password'); // Adjust the URL as needed
  
      // Verify page elements
      cy.get('input[placeholder="Enter email"]').should('be.visible');
      cy.contains('button', 'Send Reset Link').should('be.visible');
      cy.contains('Wait, I remember my password...').should('be.visible');
    });
  
    it('should display validation error for empty email', () => {
      cy.visit('/forgot-password');
      cy.contains('button', 'Send Reset Link').click();
  
      // Check for validation error
      cy.contains('Please Enter Your Email').should('be.visible');
    });
  
    it('should display validation error for invalid email format', () => {
      cy.visit('/forgot-password');
      cy.get('input[placeholder="Enter email"]').type('invalid-email');
      cy.contains('button', 'Send Reset Link').click();
  
      // Check for validation error
      cy.contains('Invalid email format').should('be.visible');
    });
  
    it('should send a reset email for valid input', () => {
      cy.visit('/forgot-password');
  
      // Mock the Firebase function
      cy.intercept('POST', '**/sendPasswordResetEmail', {
        statusCode: 200,
      }).as('sendResetEmail');
  
      cy.get('input[placeholder="Enter email"]').type('test@example.com');
      cy.contains('button', 'Send Reset Link').click();
  
      // Check for success toast message
      cy.contains('Reset Email Sent Successfully');
    });
  
    it('should navigate to the login page when "Sign in" is clicked', () => {
      cy.visit('/forgot-password');
      cy.contains('Sign in').click();
  
      // Verify redirection
      cy.url().should('include', '/login');
    });
  });
  