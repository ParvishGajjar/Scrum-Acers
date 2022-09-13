describe("Announcements_Employee Test Suite",() =>{  

    it("Check Route Announcement",()=>{
        cy.login_employee()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/Announcement")
        expect(cy.findByText(/Announcements/i))
    })

    it("Submission Enabled",() => {
        cy.login_employee()
        cy.get("button[type='submit']").should('be.disabled')
    })
})