describe('Register Page', () => {
    it('should load the register page', () => {
      cy.visit('/register'); // Adjust the URL as needed
  
      // Check for all form fields
      cy.get('input[placeholder="Enter email address"]').should('be.visible');
      cy.get('input[placeholder="Enter username"]').should('be.visible');
      cy.get('input[placeholder="Enter phone number"]').should('be.visible');
      cy.get('input[placeholder="Enter city"]').should('be.visible');
      cy.get('input[placeholder="Enter password"]').should('be.visible');
      cy.get('select[name="role"]').should('be.visible');
      cy.contains('button', 'Sign Up').should('be.visible');
    });
  
    it('should display validation errors for empty fields', () => {
      cy.visit('/register');
      cy.contains('button', 'Sign Up').click();
  
      // Check for validation messages
      cy.contains('Please Enter Email').should('be.visible');
      cy.contains('Please Enter Username').should('be.visible');
      cy.contains('Please Enter Password').should('be.visible');
      cy.contains('Please Enter Phone Number').should('be.visible');
      cy.contains('Please Enter City').should('be.visible');
      cy.contains('Please select the role Register').should('be.visible');
    });
  
    it('should display a validation error for invalid email', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Enter email address"]').type('invalid-email').blur();
  
    // Check the input's validity state
    cy.get('input[placeholder="Enter email address"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.eq(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
      );
    });
    });
  
    it('should display a validation error for invalid phone number', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Enter phone number"]').type('abc');
      cy.contains('button', 'Sign Up').click();
  
      // Check for phone number validation error
      cy.contains('Phone number must only contain numbers').should('be.visible');
    });
  
    it('should display a validation error for weak password', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Enter password"]').type('weak');
      cy.contains('button', 'Sign Up').click();
  
      // Check for password validation error
      cy.contains(
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ).should('be.visible');
    });
  
    it('should successfully register with valid data', () => {
      cy.visit('/register');
  
      // Enter valid data
      cy.get('input[placeholder="Enter email address"]').type('test@example.com');
      cy.get('input[placeholder="Enter username"]').type('testuser');
      cy.get('input[placeholder="Enter phone number"]').type('1234567890');
      cy.get('input[placeholder="Enter city"]').type('TestCity');
      cy.get('input[placeholder="Enter password"]').type('Password123!');
      cy.get('select[name="role"]').select('trainer'); // Select a role
  
      // Submit the form
      cy.contains('button', 'Sign Up').click();
  
      // Verify redirection or success message
      cy.url().should('include', '/login'); // Adjust based on your app behavior
      cy.contains('Your application was successfully sent').should('be.visible');
    });
  
    it('should toggle password visibility', () => {
      cy.visit('/register');
      cy.get('input[placeholder="Enter password"]').type('Password123!');
      cy.get('#password-addon').click(); // Adjust selector for the eye icon
  
      // Check if password visibility toggled
      cy.get('input[placeholder="Enter password"]').should('have.attr', 'type', 'text');
      cy.get('#password-addon').click();
      cy.get('input[placeholder="Enter password"]').should('have.attr', 'type', 'password');
    });
  });
  