describe('Add Courses Page', () => {
    beforeEach(() => {
      cy.visit('/AddCourses'); // Adjust the URL as necessary
    });
  
    it('should load the Add Course form', () => {
      // Check for form fields
      cy.get('input[name="title"]').should('be.visible');
      cy.get('textarea[name="description"]').should('be.visible');
      cy.get('select[name="trainer_id"]').should('be.visible');
      cy.get('input[name="startDate"]').should('be.visible');
      cy.get('input[name="endDate"]').should('be.visible');
      cy.get('input[name="price"]').should('be.visible');
      cy.get('input[name="location"]').should('be.visible');
      cy.contains('button', 'Add Course').should('be.visible');
    });
  
    it('should display validation errors for empty fields', () => {
      cy.contains('button', 'Add Course').click();
  
      // Check for validation errors
      cy.contains('Course title is required').should('be.visible');
      cy.contains('Description is required').should('be.visible');
      cy.contains('Trainer is required').should('be.visible');
      cy.contains('Start date is required').should('be.visible');
      cy.contains('End date is required').should('be.visible');
    });
  
    it('should successfully add a course with valid data', () => {
      // Fill in the form
      cy.get('input[name="title"]').type('Test Course');
      cy.get('textarea[name="description"]').type('This is a test course description.');
      cy.get('select[name="trainer_id"]').select('ammar@gmail.com'); // Replace with valid trainer ID
      cy.get('input[name="startDate"]').type('2025-01-10');
      cy.get('input[name="endDate"]').type('2025-01-20');
      cy.get('input[name="price"]').type('100');
      cy.get('input[name="location"]').type('Test Location');
  
      // Submit the form
      cy.contains('button', 'Add Course').click();
  
      // Verify success message and redirection
      cy.contains('Course added successfully!').should('be.visible');
      cy.url().should('include', '/ViewCourses'); // Adjust URL based on actual behavior
    });
  });
  
  describe('View Courses Page', () => {
    beforeEach(() => {
      cy.visit('/ViewCourses'); // Adjust the URL as necessary
      cy.wait(1000); // Adjust wait time as needed
    });
  
    it('should load the courses list table', () => {
      // Check if the table is visible
      cy.get('table').should('be.visible');
  
      // Check for headers
      cy.contains('Course Title').should('be.visible');
      cy.contains('Trainer').should('be.visible');
      cy.contains('Start Date').should('be.visible');
      cy.contains('End Date').should('be.visible');
    });
  
    it('should display a course in the list', () => {
      // Verify a specific course is listed (replace 'Test Course' with actual course title)
      cy.contains('Test Course').should('be.visible');
      cy.contains('Trainer Name').should('be.visible'); // Replace with actual trainer name
    });
  
    it('should allow deleting a course', () => {
      // Delete a course (replace 'Test Course' with actual course title)
      cy.contains('Test Course')
        .parent('tr')
        .find('.btn-soft-danger') // Adjust selector if necessary
        .click();
  
      // Confirm deletion
      cy.contains('Course deleted successfully.').should('be.visible');
      cy.contains('Test Course').should('not.exist');
    });
  
    it('should allow editing a course', () => {
      // Edit a course (replace 'Test Course' with actual course title)
      cy.contains('Test Course')
        .parent('tr')
        .find('.btn-soft-info') // Adjust selector if necessary
        .click();
  
      // Edit form fields
      cy.get('input[name="title"]').clear().type('Updated Course Title');
      cy.get('textarea[name="description"]').clear().type('Updated course description.');
      cy.contains('button', 'Save Changes').click();
  
      // Verify success message
      cy.contains('Course updated successfully.').should('be.visible');
      cy.contains('Updated Course Title').should('be.visible');
    });
  });
  