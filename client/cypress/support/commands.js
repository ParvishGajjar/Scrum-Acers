import '@testing-library/cypress/add-commands';

 // ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login_employee', (text) => {
        cy.visit('http://scrum-acers-frontend.herokuapp.com/')
        cy.get('input[name="email"]').type("emmabryan@gmail.com")
        cy.get('input[name="password"]').type("emmabryan5")
        cy.findByText(/submit/i).click()
        cy.wait(10000)
  })
Cypress.Commands.add('login_manager', (text) => {
    cy.visit('http://scrum-acers-frontend.herokuapp.com/')
    cy.get('input[name="email"]').type("robertyen@gmail.com")
    cy.get('input[name="password"]').type("robertyen4")
    cy.findByText(/submit/i).click()
    cy.wait(10000)
})