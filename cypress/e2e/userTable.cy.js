describe('User Table Functionality', () => {
    
    beforeEach(() => {
        cy.visit('/users'); // Adjust the URL as necessary
    });
  
    it('should display the user list with all columns', () => {
      // Check if the table is visible
      cy.get('table').should('be.visible');
  
      // Verify table headers
      cy.contains('MEMBER NAME').should('be.visible');
      cy.contains('EMAIL').should('be.visible');
      cy.contains('MOBILE').should('be.visible');
      cy.contains('REQUEST SENT ON').should('be.visible');
      cy.contains('STATUS').should('be.visible');
      cy.contains('ROLE').should('be.visible');
    });
  
    it('should display a specific user in the list', () => {
      // Verify a specific user is listed (replace with actual user details)
      cy.contains('Dr Ammar').should('be.visible');
      cy.contains('ammarodeh@test.com').should('be.visible');
      cy.contains('Active').should('be.visible');
    });
  
    it('should filter users by name using search', () => {
      // Search for a user
      cy.get('#searchMemberList').type('Ammar');
  
      // Verify the filtered results
      cy.contains('Ammar Odeh').should('be.visible');
      cy.contains('Abdullah Attili').should('not.exist'); // Replace with a non-matching name
    });
  
    it('should edit user details', () => {
      // Click the edit button for a user
      cy.contains('John Smith') // Replace with actual user name
        .parent('tr')
        .find('.btn-soft-info')
        .click();
  
      // Fill out the edit form
      cy.get('input[name="memberName"]').clear().type('John Smith');
      cy.get('input[name="email"]').clear().type('john.smith@example.com');
      cy.get('input[name="mobile"]').clear().type('1234567890');
      cy.get('select[name="status"]').select('1'); // Active
      cy.contains('button', 'Update Details').click();
  
      // Verify success message and updated details
      cy.contains('User Details Updated Successfully');
      cy.contains('John Smith').should('be.visible');
    });
  
    it('should delete a user from the list', () => {
      // Click the delete button for a user
      cy.contains('LosTonto') // Replace with actual user name
        .parent('tr')
        .find('.btn-soft-danger')
        .click();
  
      // Confirm the user is removed
      cy.contains('User deleted successfully.');
      cy.contains('John Doe').should('not.exist');
    });
  });
  