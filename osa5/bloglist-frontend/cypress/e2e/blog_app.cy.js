describe('Blog', function () {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    const user2 = {
      name: 'Bruce Wayne',
      username: 'batman',
      password: 'batman123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
  })

  it('login page is opened', function () {
    cy.contains('Log in to application')
    cy.contains('Username')
    cy.contains('Password')
  })
  
  describe('Login ', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('ei-salainen')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  }) 

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('a cool blog')
      cy.get('#author').type('a cool blogger')
      cy.get('#url').type('a cool website')
      cy.get('#create-button').click()
      cy.contains('a cool blog')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ 
          title: 'a cool blog',
          author: 'a cool blogger',
          url: 'a cool website' 
        })
      })

      it('it can be liked', function () {
        cy.contains('a cool blog a cool blogger')
          .contains('view')
          .click()
        cy.get('#like-button').click()

        cy.contains('a cool blog a cool blogger')
          .contains('likes 0')
      })

      it('it can be removed', function () {
        cy.contains('a cool blog a cool blogger')
          .contains('view')
          .click()
        cy.get('#remove-button').click()

        cy.get('html').should('not.contain', 'a cool blog a cool blogger')
      })

      it('only the creator should see the remove button', function () {
        cy.get('#logout-button').click()
        cy.login({ username: 'batman', password: 'batman123' })

        cy.contains('a cool blog a cool blogger')
          .contains('view')
          .click()

        cy.get('#remove-button').should('not.be.visible')
      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ 
          title: 'least likes',
          author: 'a cool blogger',
          url: 'a cool website' 
        })

        cy.createBlog({ 
          title: 'most likes',
          author: 'a cool blogger',
          url: 'a cool website' 
        })

        cy.createBlog({ 
          title: 'middle likes',
          author: 'a cool blogger',
          url: 'a cool website' 
        })
      })

      it('they are ordered by likes', function () {
        cy.contains('least likes')
          .contains('view')
          .click()

        cy.contains('least likes')
          .contains('like')
          .click()
        
        cy.contains('middle likes')
          .contains('view')
          .click()

        for(let i = 0; i < 3; i++) {
          cy.contains('middle likes')
          .contains('like')
          .click()
          cy.wait(100)
        }

        cy.contains('most likes')
          .contains('view')
          .click()

        for(let i = 0; i < 5; i++) {
          cy.contains('most likes')
          .contains('like')
          .click()
          cy.wait(100)
        }  

        cy.visit('')
        
        cy.get('#blog').should('contain', 'most likes')
        cy.get('#blog').next().should('contain', 'middle likes')
        cy.get('#blog').next().next().should('contain', 'least likes')
      })
    })  
  })
})