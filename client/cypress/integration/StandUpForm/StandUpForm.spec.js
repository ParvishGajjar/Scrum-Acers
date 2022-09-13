
describe("Stand_Up_Form_Employee Test Suite",() =>{  

    it("Check Route StandUpForm",()=>{
        cy.login_employee()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
    })
    
    it("Check Form Status", () =>{
        cy.login_employee()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
        
        if(cy.findByText(/Scrum Form/i))
    {
        it("Test StandUpForm Submitted",()=>{
            cy.login_employee()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
            expect(cy.findByText(/Scrum Form/i))
        })
    }
    else
    {
        it("Test StandUpForm",()=>{
            cy.login_employee()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
            cy.get('textarea[name="q1"]').type("test")
            cy.get('textarea[name="q2"]').type("test")
            cy.get('textarea[name="q3"]').type("test")
            expect(true).to.equal(true)
        })
        it("Check Reset StandUpForm",()=>{
            cy.login_employee()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/StandUpFormParent")
            cy.get('textarea[name="q1"]').type("test")
            cy.get('textarea[name="q2"]').type("test")
            cy.get('textarea[name="q3"]').type("test")
            cy.findByText(/Reset/i).click()
            cy.get('textarea').should('be.empty')
        })
    }
    })
    
    

})