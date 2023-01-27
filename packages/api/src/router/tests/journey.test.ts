import 'jest-extended/all'
import { describe } from '@jest/globals'
import { prisma } from '@citybiker/db'
import { TRPCError } from '@trpc/server'
import { appRouter } from '../../root'
import { getError, NoErrorThrownError } from './helpers'

describe('Journey api routes', () => {
  const api = appRouter.createCaller({
    prisma
  })

  it('getAll take 22 should some good data', async () => {
    const response = await api.journey.getAll({
      take: 22
    })

    expect(response).toBeArrayOfSize(22)
    expect(response[0].returnStationId).toBeNumber()
    expect(response[0].departureStationId).toBeNumber()
    expect(response[0].departureStationName).toBeString()
    expect(response[0].returnStationName).toBeString()
  })

  it('getAll should not return more than 50', async () => {
    const response = await getError(async () =>
      api.journey.getAll({
        take: 51
      })
    )

    expect(response).toBeInstanceOf(TRPCError)
    expect(response).not.toBeArray()
  })

  it('byId should return good data for journey 3', async () => {
    const response = await api.journey.byId(3)

    expect(response).not.toBeNull()
    expect(response).not.toBeUndefined()

    const trip = response!

    expect(trip.id).toBe(3)
    expect(trip.y).toBeNumber()
    expect(trip.x).toBeNumber()
    expect(trip.finName).toBeString()
  })

  it('byId should not return data for nonexistent journey', async () => {
    const response = await getError(async () =>
      api.journey.byId(987654323456782)
    )

    expect(response).toBeInstanceOf(NoErrorThrownError)
    expect(response).not.toBeArray()
  })
})
