describe("Stand_Up_Form_Manager Test Suite",() =>{  

    it("Check Route StandUpForm",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
        expect(cy.findByText(/Daily Stand-Up Form Reviews/i))
    })
    
    it("Open Review", () =>{
        if(cy.findByText(/Daily Stand-Up Form/i))
    {
        it("Test StandUpForm",()=>{
            cy.login_manager()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
            cy.get('button').click()
        })
    }
    else
    {
        it("Close Review",()=>{
            cy.login_employee()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
            cy.get('button').click()
            cy.get('button').click()
        })
    }
    })

})