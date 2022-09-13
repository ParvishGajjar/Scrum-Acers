
describe("login_employee",() => {
    beforeEach(() => {
        cy.visit('http://scrum-acers-frontend.herokuapp.com/')
    })
    it("login for Junior Teammate",() => {
    cy.get('input[name="email"]').type("emmabryan@gmail.com")
    cy.get('input[name="password"]').type("emmabryan5")
    cy.findByText(/submit/i).click()
    cy.wait(500)
    })

    it("login for Junior Teammate Check Route",() => {
        cy.get('input[name="email"]').type("emmabryan@gmail.com")
        cy.get('input[name="password"]').type("emmabryan5")
        cy.findByText(/submit/i).click()
        expect(cy.findByText(/Announcements/i))
        })
})

describe("login_manager",() => {
    beforeEach(() => {
        cy.visit('http://scrum-acers-frontend.herokuapp.com/')
    })
    it("login for Senior Teammate",() => {
    cy.get('input[name="email"]').type("robertyen@gmail.com")
    cy.get('input[name="password"]').type("robertyen4")
    cy.findByText(/submit/i).click()
    cy.wait(500)

    })

    it("login for Senior Teammate Check Route",() => {
        cy.get('input[name="email"]').type("robertyen@gmail.com")
        cy.get('input[name="password"]').type("robertyen4")
        cy.findByText(/submit/i).click()
        expect(cy.findByText(/Announcements/i))
        })
})