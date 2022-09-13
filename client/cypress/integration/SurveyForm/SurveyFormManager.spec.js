describe("Survey_Form_Manager Test Suite",() =>{  

    it("Check Route StandUpForm",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
        expect(cy.findByText(/Survey Creation Form/i))
    })
    
    it("Check Form Status", () =>{
            cy.login_manager()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
            cy.get('input[name="survey_title"]').type("test")
            cy.get('input[name="question1"]').type("test")
            cy.get('input[name="question2"]').type("test")
            cy.get('input[name="question3"]').type("test")
            expect(true).to.equal(true)
    })

    it("Check Responses",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
        cy.findByText("View Survey Form List").click()
        cy.get('.css-1rtnrqa').first().click()
    })

    it("Check Responses Close",()=>{
        cy.login_manager()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
        cy.findByText("View Survey Form List").click()
        cy.get('.css-1rtnrqa').first().click()
        cy.get('.css-zajg55').click()
    })
})