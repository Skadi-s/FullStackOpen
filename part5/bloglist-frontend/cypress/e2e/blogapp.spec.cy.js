describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Login to application')
  })
})