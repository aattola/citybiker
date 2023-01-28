/* eslint-disable cypress/no-assigning-return-values */
function testAvgDistance() {
  const avgDistanceStarting = cy
    .contains('The average distance of a journey starting from the station')
    .next()

  avgDistanceStarting.invoke('text').then(parseFloat).should('be.gt', 0.1)

  const avgDistanceEnding = cy
    .contains('The average distance of a journey ending at the station')
    .next()

  avgDistanceEnding.invoke('text').then(parseFloat).should('be.gt', 0.1)
}

function testTotalJourneyCount() {
  const starting = cy
    .contains('Total number of journeys starting from the station')
    .next()

  starting.invoke('text').then(parseFloat).should('be.gt', 1000)

  const ending = cy
    .contains('Total number of journeys ending at the station')
    .next()

  ending.invoke('text').then(parseFloat).should('be.gt', 1000)
}

describe('Specific station test', () => {
  beforeEach(function () {
    cy.visit('http://localhost:3000/station/3')
  })

  it('loads the correct data for station 3', () => {
    cy.contains('Tehtaankatu 13')
    cy.contains('Kapteeninpuistikko')

    testTotalJourneyCount()
    testAvgDistance()

    cy.intercept('/api/trpc/station.byIdFilteredByMonth?*').as('getStationInfo')
    cy.get('.chakra-select').select('May')

    cy.wait('@getStationInfo')

    testTotalJourneyCount()
    testAvgDistance()

    cy.get('.chakra-select').select('June')
    cy.wait('@getStationInfo')

    testTotalJourneyCount()
    testAvgDistance()

    cy.get('.chakra-select').select('July')
    cy.wait('@getStationInfo')

    testTotalJourneyCount()
    testAvgDistance()

    cy.contains('Top 5').click()

    cy.contains('Top 5 return stations for journeys starting from')
    cy.contains('Top 5 departure stations for journeys ending here')

    cy.contains('Station')
    cy.contains('Count')
  })
})

export {}
