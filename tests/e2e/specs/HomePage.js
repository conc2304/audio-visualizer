
describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('loads the homepage', () => {
    cy.contains('h1', 'VYZBY');
    cy.contains('h2', 'A visceral interactive digital canvas to play and create in.');
  });

  it('has link to playground', () => {
    cy.contains('.btn-wrapper a', 'To Playground').click();
    cy.url().should('contain', '/playground');
    cy.go('back');
    cy.url().should('contain', '/');
  });

  it('has login button', () => {
    cy.contains('.user-wrapper button', 'Login').click();
  });
});
