describe('Audit Log Page Functionality', () => {
    beforeEach(() => {
      cy.visit('/audit-log'); // Adjust the URL if necessary
    });
  
    it('should display the audit log page with all elements', () => {
      // Check for page title
      cy.contains('h2', 'Audit Logs').should('be.visible');
  
      // Check for search bar and filters
      cy.get('input[placeholder="Search logs..."]').should('be.visible');
      cy.contains('Filter by Action').should('be.visible');
      cy.contains('Filter by User ID').should('be.visible');
  
      // Check for Export CSV button
      cy.contains('button', 'Export CSV').should('be.visible');
  
      // Check for table headers
      cy.contains('th', 'Action').should('be.visible');
      cy.contains('th', 'Details').should('be.visible');
      cy.contains('th', 'User').should('be.visible');
      cy.contains('th', 'Timestamp').should('be.visible');
    });
  
    it('should filter logs by action', () => {
      // Select an action to filter
      cy.get('select[title="Filter by Action"]').select('Create Course'); // Adjust action name
      cy.get('table').within(() => {
        cy.contains('td', 'Create Course').should('be.visible');
      });
    });
  
    it('should filter logs by user ID', () => {
      // Select a user ID to filter
      cy.get('select[title="Filter by User ID"]').select('user-id'); // Replace 'user-id' with a valid user ID
      cy.get('table').within(() => {
        cy.contains('td', 'user-id').should('be.visible');
      });
    });
  
    it('should display details for a log entry', () => {
      // Expand details for a specific log entry
      cy.contains('View Details').click();
      cy.get('.collapse.show').should('be.visible');
      cy.get('.collapse.show table').should('be.visible');
    });
  
    it('should search logs', () => {
      // Search for a log entry
      cy.get('input[placeholder="Search logs..."]').type('Create Course');
      cy.get('table').within(() => {
        cy.contains('td', 'Create Course').should('be.visible');
      });
    });
  
    it('should show no results for unmatched search', () => {
      // Search for an invalid entry
      cy.get('input[placeholder="Search logs..."]').type('Invalid Log');
      cy.contains('No logs available').should('be.visible');
    });
  
    it('should export logs as a CSV file', () => {
      // Click the Export CSV button
      cy.contains('button', 'Export CSV').click();
  
      // Check if the file download is triggered
      cy.readFile('cypress/downloads/audit_logs.csv').should('exist');
    });
  });
  