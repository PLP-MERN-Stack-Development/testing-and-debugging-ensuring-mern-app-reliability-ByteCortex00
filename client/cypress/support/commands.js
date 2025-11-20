// client/cypress/support/commands.js

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to create a post
Cypress.Commands.add('createPost', (postData) => {
  cy.request('POST', 'http://localhost:5000/api/posts', postData);
});

// Custom command to get all posts
Cypress.Commands.add('getPosts', () => {
  cy.request('GET', 'http://localhost:5000/api/posts');
});

// Custom command to clear all posts
Cypress.Commands.add('clearPosts', () => {
  cy.request('GET', 'http://localhost:5000/api/posts').then((response) => {
    response.body.forEach((post) => {
      cy.request('DELETE', `http://localhost:5000/api/posts/${post._id}`);
    });
  });
});