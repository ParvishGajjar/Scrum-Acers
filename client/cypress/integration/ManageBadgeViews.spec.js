describe("Manager_Badge_Views Test Suite",() =>{  

    it("Check Route Announcement",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/ManagerBadgeViews")
        expect(cy.findByText(/Employee Name/i))
    })

    it("Select Chips",() => {
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/ManagerBadgeViews")
        cy.get(".MuiChip-label").first().click()
    })

    it("Selected Chips",() => {
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/ManagerBadgeViews")
        cy.get(".MuiChip-label").first().click()
        cy.get(".css-1hw9j7s").first().click()
    })
    
})