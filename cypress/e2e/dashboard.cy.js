describe('Dashboard Functionality', () => {
    context('Main Dashboard', () => {
      it('should show a spinner while loading', () => {
        cy.visit('/dashboard'); // Adjust URL as needed
        cy.contains('Loading...').should('be.visible');
      });
  
      it('should load the Admin Dashboard for admin role', () => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'admin' })
        );
        cy.visit('/dashboard');
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Trainees Enrolled').should('be.visible');
        cy.contains('Trainers Available').should('be.visible');
        cy.contains('Active Courses').should('be.visible');
      });
  
      it('should load the Trainer Dashboard for trainer role', () => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'trainer' })
        );
        cy.visit('/dashboard');
        cy.contains('Trainer Dashboard').should('be.visible');
        cy.contains('Courses Assigned').should('be.visible');
        cy.contains('Trainees').should('be.visible');
      });
  
      it('should load the Trainee Dashboard for trainee role', () => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'trainee' })
        );
        cy.visit('/dashboard');
        cy.contains('Trainee Dashboard').should('be.visible');
        cy.contains('Courses Enrolled').should('be.visible');
        cy.contains('Assignments Completed').should('be.visible');
      });
  
      it('should show error for invalid role', () => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'unknown' })
        );
        cy.visit('/dashboard');
        cy.contains('No role assigned or invalid user.').should('be.visible');
      });
    });
  
    context('Admin Dashboard', () => {
      beforeEach(() => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'admin' })
        );
        cy.visit('/dashboard');
      });
  
      it('should display user stats', () => {
        cy.contains('Trainees Enrolled').should('be.visible');
        cy.contains('Trainers Available').should('be.visible');
        cy.contains('Active Courses').should('be.visible');
      });
  
      it('should display charts', () => {
        cy.contains('User Distribution').should('be.visible');
        cy.contains('Monthly Course Data').should('be.visible');
      });
  
      it('should display recent activities', () => {
        cy.contains('Recent Activities').should('be.visible');
        cy.get('table').should('be.visible');
      });
    });
  
    context('Trainer Dashboard', () => {
      beforeEach(() => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'trainer' })
        );
        cy.visit('/dashboard');
      });
  
      it('should display assigned courses and trainees', () => {
        cy.contains('Courses Assigned').should('be.visible');
        cy.contains('Trainees').should('be.visible');
      });
  
      it('should display recent submissions', () => {
        cy.contains('Recent Submissions').should('be.visible');
        cy.get('table').should('be.visible');
      });
    });
  
    context('Trainee Dashboard', () => {
      beforeEach(() => {
        sessionStorage.setItem(
          'user_details',
          JSON.stringify({ status: 1, role: 'trainee' })
        );
        cy.visit('/dashboard');
      });
  
      it('should display enrolled courses and completed assignments', () => {
        cy.contains('Courses Enrolled').should('be.visible');
        cy.contains('Assignments Completed').should('be.visible');
      });
  
      it('should display enrolled courses table', () => {
        cy.contains('Enrolled Courses').should('be.visible');
        cy.get('table').should('be.visible');
      });
  
      it('should display announcements', () => {
        cy.contains('Recent Announcements').should('be.visible');
      });
    });
  });
  