describe('Journeys list', () => {
  beforeEach(function () {
    cy.visit('http://localhost:3000/journeys')
  })

  it('loads the correct data for journeys', () => {
    cy.contains('Departure station')
    cy.contains('Return station')
    cy.contains('Distance travelled')
    cy.contains('Duration of the ride')

    cy.contains('Lastenlehto')
    cy.contains('Itämerentori')
    cy.contains('Vanha Kauppahalli')
    cy.contains('0.7')
    cy.contains('3m 56s')
  })

  it('search works correctly', () => {
    cy.get('[placeholder="Search for journeys"]').type('Puistolantori')

    cy.contains('Puistolantori')
    cy.contains('0.9')
    cy.contains('6m 11s')
  })

  // TODO: add more when filtering is implemented
})

export {}
