context('Signin flow - happy path', () => {
    beforeEach(() => {
        cy.visit('localhost:3000/login');
    });

    it('Successfully signs ip', () => {
        const email = 'z@gmail.com';
        const password = '123';
        
        cy.get('input[name=email]')
          .focus()
          .type(email); 

        cy.get('input[name=password]')
          .focus()
          .type(password);

        cy.get('button[type=submit]')
          .click()
        cy.get('ul')
          .then(el => {
            expect(el.text()).to.contain('Edit')
          })
        cy.contains('Edit')
          .click()
        cy.contains('Create a new question')
          .click()
        cy.contains('Dashboard')
          .click()
        cy.contains('Delete')
          .click()
    });  
});


