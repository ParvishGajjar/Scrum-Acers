

describe("Survey_Form_Employee Test Suite",() =>{  

    it("Check Route StandUpForm",()=>{
        cy.login_employee()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
        expect(cy.findByText(/Survey Forms/i))
    })
    
    it("Check Form Status", () =>{
            cy.login_employee()
            cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
            cy.get('.css-morr9g')
    })

    it("Check Responses",()=>{
        cy.login_employee()
        cy.visit("http://scrum-acers-frontend.herokuapp.com/SurveyFormParent")
        cy.get('.css-morr9g').click()
        cy.get('textarea[name="question1"]').type("test")
        cy.get('textarea[name="question2"]').type("test")
        cy.get('textarea[name="question3"]').type("test")
    })

})