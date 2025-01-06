describe('Login Page', () => {
  it('should load the login page', () => {
    cy.visit('/login'); // Adjust the path if needed
    cy.get('input[placeholder="Enter email"]').should('exist');
    cy.get('input[placeholder="Enter password"]').should('exist');
    cy.contains('button', 'Sign In').should('exist');
  });

  it('should allow a user to log in', () => {
    cy.visit('/login');
    cy.get('input[placeholder="Enter email"]').type('test@test.com');
    cy.get('input[placeholder="Enter password"]').type('Test1234@', { force: true });
    cy.contains('button', 'Sign In').click();

    // Assert that the user is redirected to the dashboard or some expected page
    cy.url().should('include', '/dashboard'); // Adjust `/dashboard` to match your app
  });
});

describe('Login Page - Validation', () => {
  it('should display validation errors for empty fields', () => {
    cy.visit('/login');

    // Click Sign In without filling in any fields
    cy.contains('button', 'Sign In').click();

    // Check for validation error messages
    cy.contains('Please Enter Your Email').should('be.visible');
    cy.contains('Please Enter Your Password').should('be.visible');
  });

  it('should detect invalid email format using native validation', () => {
    cy.visit('/login');
  
    // Enter invalid email and blur the field
    cy.get('input[placeholder="Enter email"]').type('invalid-email').blur();
  
    // Check the input's validity state
    cy.get('input[placeholder="Enter email"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.eq(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
      );
    });
  });
});

describe('Login Page - Additional Tests', () => {
  it('should display an error message for incorrect credentials', () => {
  cy.visit('/login');

  // Enter incorrect credentials
  cy.get('input[placeholder="Enter email"]').type('wrong@example.com');
  cy.get('input[placeholder="Enter password"]').type('wrongpassword');
  cy.contains('button', 'Sign In').click();


  // Check for the error message on the page
  cy.contains('Incorrect Email or Password.').should('be.visible');

});



  it('should redirect to the dashboard on successful login', () => {
    cy.visit('/login');

    // Enter valid credentials
    cy.get('input[placeholder="Enter email"]').type('test@test.com');
    cy.get('input[placeholder="Enter password"]').type('Test1234@');
    cy.contains('button', 'Sign In').click();

    // Verify redirection to the dashboard
    cy.url().should('include', '/dashboard'); // Adjust URL to your app
  });

});