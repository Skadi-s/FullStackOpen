describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
    cy.contains('login').click()
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })
})

describe('Login', function() {
  it('succeeds with correct credentials', function() {
    cy.get('#username').type('root')
    cy.get('#password').type('sekret')
    cy.get('#login-button').click()

    cy.contains('root logged in')
  })

  it('fails with wrong credentials', function() {
    cy.get('#username').type('root')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('Wrong username or password')
  })
})