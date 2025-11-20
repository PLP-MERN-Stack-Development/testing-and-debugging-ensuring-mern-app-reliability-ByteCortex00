// client/cypress/e2e/posts.cy.js

describe('Posts E2E Tests', () => {
  beforeEach(() => {
    // Clear all posts before each test
    cy.clearPosts();
    // Visit the app
    cy.visit('/');
  });

  it('should load the app and display the title', () => {
    cy.contains('Reliable MERN App').should('be.visible');
  });

  it('should create a new post', () => {
    const postTitle = 'E2E Test Post';
    const postContent = 'This is content from an E2E test';

    // Fill out the form
    cy.get('input[placeholder="Title"]').type(postTitle);
    cy.get('textarea[placeholder="Content"]').type(postContent);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify the post appears in the list
    cy.contains(postTitle).should('be.visible');
    cy.contains(postContent).should('be.visible');
  });

  it('should display multiple posts', () => {
    // Create posts via API
    cy.createPost({
      title: 'First Post',
      content: 'First content',
      author: 'Test Author 1'
    });

    cy.createPost({
      title: 'Second Post',
      content: 'Second content',
      author: 'Test Author 2'
    });

    // Reload the page
    cy.reload();

    // Check that both posts are displayed
    cy.contains('First Post').should('be.visible');
    cy.contains('Second Post').should('be.visible');
    cy.contains('First content').should('be.visible');
    cy.contains('Second content').should('be.visible');
  });

  it('should show loading state when submitting', () => {
    // Fill out the form
    cy.get('input[placeholder="Title"]').type('Loading Test');
    cy.get('textarea[placeholder="Content"]').type('Testing loading state');

    // Submit and check for loading text
    cy.get('button[type="submit"]').click();
    cy.contains('Adding...').should('be.visible');
  });

  it('should clear form after successful submission', () => {
    // Fill out the form
    cy.get('input[placeholder="Title"]').type('Clear Form Test');
    cy.get('textarea[placeholder="Content"]').type('Form should clear');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check that form is cleared
    cy.get('input[placeholder="Title"]').should('have.value', '');
    cy.get('textarea[placeholder="Content"]').should('have.value', '');
  });

  it('should handle form validation errors', () => {
    // Try to submit without title
    cy.get('textarea[placeholder="Content"]').type('Content without title');
    cy.get('button[type="submit"]').click();

    // Should show error (though in this simple app, it might not show UI error)
    // At minimum, the post shouldn't appear
    cy.contains('Content without title').should('not.exist');
  });

  it('should display posts in correct order (newest first)', () => {
    // Create posts with timestamps
    cy.createPost({
      title: 'Older Post',
      content: 'This should appear second',
      author: 'Author'
    });

    // Wait a moment
    cy.wait(100);

    cy.createPost({
      title: 'Newer Post',
      content: 'This should appear first',
      author: 'Author'
    });

    // Reload and check order
    cy.reload();

    // The newer post should appear first
    cy.get('.post-card').first().contains('Newer Post').should('be.visible');
    cy.get('.post-card').last().contains('Older Post').should('be.visible');
  });
});