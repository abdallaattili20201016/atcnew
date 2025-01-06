describe('User Profile Page', () => {
    it('should load the profile page with user details', () => {
      cy.visit('/user-profile'); // Adjust the URL if needed
  
      // Check for user details
      cy.get('.avatar-lg').should('be.visible');
      cy.contains('h5', 'testuser').should('be.visible'); // Replace 'username' with a sample username
      cy.contains('p', 'test@example.com').should('be.visible'); // Replace 'email@example.com' with a sample email
      cy.contains('p', '1234567890').should('be.visible'); // Replace with a sample phone number
    });
  
    it('should display validation errors for empty fields', () => {
      cy.visit('/user-profile');
  
      // Submit form with empty fields
      cy.get('input[name="city"]').clear();
      cy.get('input[name="street"]').clear();
      cy.contains('button', 'Update Profile').click();
  
      // Check for validation errors
      cy.contains('Please enter your city').should('be.visible');
      cy.contains('Please enter your street').should('be.visible');
    });
  
    it('should allow valid profile updates', () => {
      cy.visit('/user-profile');
  
      // Fill in valid data
      cy.get('input[name="city"]').clear().type('NewCity');
      cy.get('input[name="street"]').clear().type('NewStreet');
      cy.get('input[name="avatar"]').selectFile('path/to/sample-avatar.jpg'); // Adjust the file path
  
      // Submit the form
      cy.contains('button', 'Update Profile').click();
  
      // Check for success toast message
      cy.contains('Profile updated successfully').should('be.visible');
    });
  
    it('should handle invalid file upload', () => {
      cy.visit('/user-profile');
  
      // Upload an invalid file type
      cy.get('input[name="avatar"]').selectFile('path/to/invalid-file.txt'); // Adjust the file path
      cy.contains('button', 'Update Profile').click();
  
      // Ensure no success message is shown
      cy.contains('Profile updated successfully').should('not.exist');
      cy.contains('Avatar upload failed').should('be.visible');
    });
  
    it('should handle API errors gracefully', () => {
      cy.visit('/user-profile');
  
      // Mock API failure
      cy.intercept('POST', '**/updateUserDetails', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('updateProfile');
  
      // Fill in valid data
      cy.get('input[name="city"]').clear().type('NewCity');
      cy.get('input[name="street"]').clear().type('NewStreet');
      cy.contains('button', 'Update Profile').click();
  
      // Wait for the API response
      cy.wait('@updateProfile');
  
      // Check for error toast
      cy.contains('Profile update failed').should('be.visible');
    });
  });
  