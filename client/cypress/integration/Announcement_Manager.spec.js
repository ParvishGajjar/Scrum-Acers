describe("Announcements_Manager Test Suite",() =>{  

    it("Check Route Announcement",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/Announcement")
        expect(cy.findByText(/Announcements/i))
    })

    it("Submission Enabled",() => {
        cy.login_manager()
        cy.get("button[type='submit']").should('not.be.disabled')
    })
})