describe('Chat Sidebar Functionality', () => {
    beforeEach(() => {
      cy.visit('/messages'); // Adjust the URL as necessary
        cy.wait(1000); // Adjust wait time as needed
    });
  
    it('should display Recent Chats section', () => {
      cy.contains('Recent Chats').should('be.visible');
      cy.get('.list-group-item').should('have.length.greaterThan', 0); // Verify at least one chat
    });
  
    it('should display All Users section', () => {
      cy.contains('All Users').should('be.visible');
      cy.get('.list-group-item').should('have.length.greaterThan', 0); // Verify at least one user
    });
  
    it('should allow selecting a recent chat', () => {
      // Replace with dynamic or mock data
      cy.contains('Recent Chats')
        .next()
        .find('button')
        .first()
        .click();
      cy.contains('Type your message').should('be.visible'); // Adjust this based on actual UI
    });
  
    it('should allow selecting a user from All Users', () => {
      // Replace with dynamic or mock data
      cy.contains('All Users')
        .next()
        .find('button')
        .first()
        .click();
      cy.contains('Type your message').should('be.visible'); // Adjust this based on actual UI
    });
  });
  describe('Chat Window Functionality', () => {
    beforeEach(() => {
      cy.visit('/messages');
      cy.wait(1000); // Adjust the URL as necessary
      // Simulate selecting a chat/user
      cy.contains('Recent Chats').next().find('button').first().click();
    });
  
    it('should display chat messages', () => {
      cy.get('.p-2').should('be.visible');
      cy.get('.p-2').find('.mb-1').should('have.length.greaterThan', 0); // Verify messages exist
    });
  
    it('should allow sending a message', () => {
      cy.get('textarea').type('Hello, Cypress!');
      cy.contains('button', 'Send').click();
      cy.get('.p-2').contains('Hello, Cypress!').should('be.visible');
    });
  
    it('should scroll to the bottom when a new message is added', () => {
      cy.get('.chat-messages').invoke('scrollTop').should('equal', 0); // Initially at the top
      cy.get('textarea').type('Test Scroll');
      cy.contains('button', 'Send').click();
      cy.get('.p-2').invoke('scrollTop').should('not.equal', 0); // Scrolled to bottom
    });
  });
  