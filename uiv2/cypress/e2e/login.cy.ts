import {baseURL, account} from "./data"

describe('Login Page', () => {
 
  it('should check neccesary component and error message', () => {
    cy.visit(baseURL);

    cy.get("[data-testid='login-page']").contains("Enter you account");
    cy.get("[data-testid='login']").contains('Login').click();
    cy.get("[data-testid='login-error-message']").contains(/Please Complete the form/i);

    cy.get("[data-testid='login-email-username']").type("Sample", {timeout: 300});
    cy.get("[data-testid='login-password']").type("SamplePassword", {timeout: 300});

    cy.get("[data-testid='login']").contains('Login').click();
    cy.get("[data-testid='login-error-message']").contains(/Invalid credentials/i);
  })

  it('Admin should able to login and sign out', () => {
    cy.visit(baseURL);

    cy.get("[data-testid='login-email-username']").clear().type(account.admin.user, {timeout: 300})
    cy.get("[data-testid='login-password']").clear().type(account.admin.password, {timeout: 300})

    cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
    cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);

    cy.get("[data-testid='sign-out']").contains(/Sign Out/i).click({timeout: 1000});
    cy.get("[data-testid='login-page']").contains("Enter you account");
  })

  it('Staff should able to login and sign out', () => {
    cy.visit(baseURL);

    cy.get("[data-testid='login-email-username']").clear().type(account.staff.user, {timeout: 300})
    cy.get("[data-testid='login-password']").clear().type(account.staff.password, {timeout: 300})

    cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
    cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);

    cy.get("[data-testid='sign-out']").contains(/Sign Out/i).click({timeout: 1000});
    cy.get("[data-testid='login-page']").contains("Enter you account");
  })

  it('Student should able to login and sign out', () => {
    cy.visit(baseURL);

    cy.get("[data-testid='login-email-username']").clear().type(account.student.user, {timeout: 300})
    cy.get("[data-testid='login-password']").clear().type(account.student.password, {timeout: 300})

    cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
    cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);

    cy.get("[data-testid='student-sign-out']").contains(/Sign Out/i).click({timeout: 1000});
    cy.get("[data-testid='login-page']").contains("Enter you account");
  })

})


