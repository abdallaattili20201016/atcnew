describe('Announcements Table Functionality', () => {
    beforeEach(() => {
      cy.visit('/announcements-table'); // Adjust the URL as necessary
      cy.wait(2000); // Adjust wait time as needed
    });
  
    it('should display the Announcements Table with all columns', () => {
      // Check for table headers
      cy.contains('th', 'Title').should('be.visible');
      cy.contains('th', 'Description').should('be.visible');
      cy.contains('th', 'Created By').should('be.visible');
      cy.contains('th', 'Date').should('be.visible');
      cy.contains('th', 'Actions').should('be.visible');
    });
  
    it('should display announcements in the table', () => {
      // Verify that at least one announcement is listed
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
  
      // Check for specific announcement details (replace with valid data)
      cy.contains('forex course').should('be.visible');
      cy.contains('forex course has been uploaded').should('be.visible');
      cy.contains('Abdallah Attili').should('be.visible');
    });
  
    it('should allow admins to create a new announcement', () => {
      // Verify Create New Announcement button is visible for admin
      cy.get('button').contains('Create New Announcement').should('be.visible').click();
  
      // Redirect to creation page and fill the form (mock behavior)
      cy.url().should('include', '/admin-announcements/new');
      cy.get('input[name="title"]').type('New Announcement');
      cy.get('textarea[name="description"]').type('This is a new announcement description.');
      cy.contains('button', 'Save').click();
  
      // Verify success and redirection
      cy.contains('Announcement created successfully').should('be.visible');
      cy.visit('/AnnouncementsTable');
      cy.contains('New Announcement').should('be.visible');
    });
  
    it('should allow admins to delete an announcement', () => {
      // Delete a specific announcement (replace with valid data)
      cy.contains('Sample Announcement Title') // Replace with an actual title
        .parent('tr')
        .find('.btn-soft-danger') // Delete button selector
        .click();
  
      // Confirm deletion and verify removal
      cy.contains('Announcement deleted successfully').should('be.visible');
      cy.contains('Sample Announcement Title').should('not.exist');
    });
  
    it('should display details in a modal when viewing an announcement', () => {
      // View announcement details
      cy.contains('Sample Announcement Title') // Replace with an actual title
        .parent('tr')
        .find('.btn-soft-secondary') // View button selector
        .click();
  
      // Verify modal content
      cy.contains('Announcement Details').should('be.visible');
      cy.contains('Sample Announcement Title').should('be.visible');
      cy.contains('Sample description').should('be.visible');
  
      // Close the modal
      cy.get('.modal-footer').contains('Close').click();
      cy.contains('Announcement Details').should('not.exist');
    });
  
    it('should restrict delete access for non-admin users', () => {
      // Simulate a non-admin user
      sessionStorage.setItem('user_details', JSON.stringify({ role: 'trainer' }));
      cy.visit('/announcement-table');
  
      // Ensure delete button is not visible
      cy.contains('Sample Announcement Title') // Replace with an actual title
        .parent('tr')
        .find('.btn-soft-danger')
        .should('not.exist');
    });
  });
  