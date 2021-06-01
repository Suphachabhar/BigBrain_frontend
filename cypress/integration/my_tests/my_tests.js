context('Signup flow - happy path', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
    });

    it('Successfully signs up', () => {
        const email = 'g@gmail.com';
        const password = '123';
        const name = 'g';
        
        cy.get('input[name=email]')
          .focus()
          .type(email); 

        cy.get('input[name=password]')
          .focus()
          .type(password);

        cy.get('input[name=name]')
          .focus()
          .type(name);

        cy.get('button[type=submit]')
          .click()
        
        cy.get('button[id="newgame"]')
          .click()

        const namegame = 'example1';
  
        cy.get('input[name=name]')
          .focus()
          .type(namegame); 
  
        cy.get('button[id="newgame"]')
          .click()

        cy.get('ul')
          .then(el => {
            expect(el.text()).to.contain('Create session')
          })
        cy.contains('Create session')
          .click()
        cy.contains('Stop session')
          .click()
        cy.contains('See results')
          .click()
        cy.contains('Logout')
          .click()
        
        cy.get('input[name=email]')
          .focus()
          .type(email); 
  
        cy.get('input[name=password]')
          .focus()
          .type(password);
  
        cy.get('button[type=submit]')
          .click()
    });  
});


