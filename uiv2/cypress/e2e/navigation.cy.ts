import {baseURL, account} from "./data";

describe('Admin Navigation', () => {
  it('Admin should able to view dashbard and Navigate', () => {
      cy.visit(baseURL)

      cy.get("[data-testid='login-email-username']").clear().type(account.admin.user, {timeout: 300})
      cy.get("[data-testid='login-password']").clear().type(account.admin.password, {timeout: 300})

      cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
      cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);

      cy.get("[data-testid='header-title']").contains("Activity Tracker");
      cy.wait(3000);
      cy.log("should able to click the Overview and its view sections")
      
      cy.get("[data-testid='dashboard-link']").contains("Overview").click();
      cy.wait(3000);
      cy.get("[data-testid='overview-section']").should('be.visible');
     
      cy.log("should able to click the Activity and its view sections")
      cy.get("[data-testid='dashboard-activity-link']").contains("Activity").click();
      cy.wait(3000);
      cy.get("[data-testid='activity-section']").should('be.visible');
     
      cy.log("should able to click the Club and Organization and its view sections")
      cy.get("[data-testid='dashboard-club-organizatons-link']").contains("Club and Organization").click();
      cy.wait(3000);
      cy.get("[data-testid='club-organizatons-section']").should('be.visible');
      
      cy.log("should able to click the User and its view sections")
      cy.get("[data-testid='dashboard-user-link']").contains("User").click();
      cy.wait(3000);
      cy.get("[data-testid='user-section']").should('be.visible');
     
      cy.log("should able to click the Manage and its view sections")
      cy.get("[data-testid='dashboard-manage-link']").contains("Manage").click();
      cy.wait(3000);
      cy.get("[data-testid='manage-section']").should('be.visible');
  })
})


describe('Staff Navigation', () => {
   it('Staff should able to view dashbard and Navigate', () => {
       cy.visit(baseURL)
 
       cy.get("[data-testid='login-email-username']").clear().type(account.staff.user, {timeout: 300})
       cy.get("[data-testid='login-password']").clear().type(account.staff.password, {timeout: 300})
 
       cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
       cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);
 
       cy.get("[data-testid='header-title']").contains("Activity Tracker");
       cy.wait(3000);
       cy.log("should able to click the Overview and its view sections")

       cy.get("[data-testid='dashboard-link']").contains("Overview").click();
       cy.wait(3000);
       cy.get("[data-testid='overview-section']").should('be.visible');
      
       cy.log("should able to click the Activity and its view sections")
       cy.get("[data-testid='dashboard-activity-link']").contains("Activity").click();
       cy.wait(3000);
       cy.get("[data-testid='activity-section']").should('be.visible');
      
       cy.log("should able to click the Club and Organization and its view sections")
       cy.get("[data-testid='dashboard-club-organizatons-link']").contains("Club and Organization").click();
       cy.wait(3000);
       cy.get("[data-testid='club-organizatons-section']").should('be.visible');
       
       cy.log("should able to click the User and its view sections")
       cy.get("[data-testid='dashboard-user-link']").contains("User").click();
       cy.wait(3000);
       cy.get("[data-testid='user-section']").should('be.visible');

       cy.log("Manage link should not be exist")
       cy.get("[data-testid='dashboard-manage-link']").should("not.exist")
   })
 })


 describe('Student Navigation', () => {
   it('Staff should able to view dashbard and Navigate', () => {
       cy.visit(baseURL)
 
       cy.get("[data-testid='login-email-username']").clear().type(account.student.user, {timeout: 300})
       cy.get("[data-testid='login-password']").clear().type(account.student.password, {timeout: 300})
 
       cy.get("[data-testid='login']").contains('Login').click({timeout: 1000});
       cy.get("[data-testid='login-success-message']").contains(/Succesfully login/i);
      
       cy.log("Student should not contain any component link and section component of Member users")
       cy.get("[data-testid='header-title']").should("not.exist")
       cy.get("[data-testid='dashboard-link']").should("not.exist")
       cy.get("[data-testid='overview-section']").should("not.exist")
      
       cy.get("[data-testid='dashboard-activity-link']").should("not.exist")
       cy.get("[data-testid='activity-section']").should("not.exist")
      
       cy.get("[data-testid='dashboard-club-organizatons-link']").should("not.exist")
       cy.get("[data-testid='club-organizatons-section']").should("not.exist")

       cy.get("[data-testid='dashboard-user-link']").should("not.exist")
       cy.get("[data-testid='user-section']").should("not.exist")
      
       cy.get("[data-testid='dashboard-manage-link']").should("not.exist")
       cy.get("[data-testid='manage-section']").should("not.exist")

       cy.get("[data-testid='student-dashboard-link']").contains("Club and Organization").click();
       cy.wait(3000);
       cy.get("[data-testid='student-overview-section']").should('be.visible');

       cy.log("should able to click the Activity and its view sections")
       cy.get("[data-testid='student-dashboard-activity-link']").contains("Activity").click();
       cy.wait(3000);
       cy.get("[data-testid='student-activity-section']").should('be.visible');
   })
 })
