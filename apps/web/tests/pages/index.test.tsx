import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../../src/pages'
describe('Home', () => {
  it('renders correct links', () => {
    render(<Home />)

    const journeyLink = screen.getByRole('link', {
      name: 'Journeys'
    })

    const stationLink = screen.getByRole('link', {
      name: 'Stations'
    })

    expect(journeyLink).toBeInTheDocument()
    expect(stationLink).toBeInTheDocument()
  })
})
