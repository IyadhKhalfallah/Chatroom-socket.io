describe("renders the homepage", () => {
    it("renders correctly", () => {
        cy.visit('http://localhost:3000/')
        cy.get('.auth-inner').should('exist')
    })
})
describe("Fills sign in form", () => {
    it("Fills correctly", () => {
        cy.visit('http://localhost:3000/')
        cy.get('#email')
            .should('be.visible')
            .type('iyadh@gmail.com')
        cy.get('#password')
            .should('be.visible')
            .type('test123')
        cy.get('button[type="submit"]')
            .should('be.visible')
            .click()
        cy.get('.list-group').should('exist')
    })
})