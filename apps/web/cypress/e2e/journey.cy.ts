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

  it('pagination works correctly', () => {
    cy.intercept('/api/trpc/journey.getAll?*').as('getStationInfo')
    cy.contains('Load More').click()
    cy.wait('@getStationInfo')
  })

  it('sorting by distance works correctly', () => {
    cy.contains('Distance travelled (km)').click()

    cy.contains('163.9')

    cy.contains('Distance travelled (km)').click()

    cy.contains('0.00')
  })

  it('sorting by duration works correctly', () => {
    cy.contains('Duration of the ride (min)').click()

    cy.contains('1358h')

    cy.contains('Duration of the ride (min)').click()

    cy.contains('11s')
  })
})

export {}
