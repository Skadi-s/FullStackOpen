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

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        username: 'root',
        name: 'Superuser',
        password: 'sekret'
      }
      cy.request('POST', 'http://localhost:3000/api/users', user)
      cy.visit('http://localhost:5173')
    })

    it('A blog can be created', function() {
      cy.contains('Login to application')
      cy.contains('login').click()

      cy.get('#username').type('root')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')

      cy.contains('new blog').click()
      cy.get('#title').type('Cypress Testing Blog')
      cy.get('#author').type('Cypress Author')
      cy.get('#url').type('http://example.com')
      cy.get('#create-button').click()
    })
    
  })
})

describe('Login', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3000/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('succeeds with correct credentials', function() {
    cy.contains('Login to application')
    cy.contains('login').click()  

    cy.get('#username').type('root')
    cy.get('#password').type('sekret')
    cy.get('#login-button').click()

    cy.contains('Superuser logged in')
  })

  it('fails with wrong credentials', function() {
    cy.contains('Login to application')
    cy.contains('login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('Wrong username or password')
  })
})