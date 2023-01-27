import { it, describe } from '@jest/globals'
import { prisma } from '@citybiker/db'
import { inferRouterOutputs, TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { AppRouter, appRouter } from '../../root'

import 'jest-extended/all'
class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call()

    throw new NoErrorThrownError()
  } catch (error: unknown) {
    return error as TError
  }
}

type RouterOutput = inferRouterOutputs<AppRouter>

const nonexistentId = 987654323456782
describe('Station api routes', () => {
  const api = appRouter.createCaller({
    prisma
  })

  it('getTop should return 404 with non existent station', async () => {
    const response: RouterOutput['station']['getTopById'] = await getError(
      async () => api.station.getTopById(nonexistentId)
    )

    if (response instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(response)

      expect(httpCode).toBe(404)
    }
    expect.assertions(1)
  })

  it('getTop should some good data for station 3', async () => {
    const response = await api.station.getTopById(3)

    expect(response.endingAt).toBeArrayOfSize(5)
    expect(response.startingFrom).toBeArrayOfSize(5)
  })

  it('byId should return 404 with non existent station', async () => {
    const response = await getError(async () => api.station.byId(nonexistentId))

    if (response instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(response)

      expect(httpCode).toBe(404)
    }
    expect.assertions(1)
  })

  it('byId should correct data for station 3', async () => {
    const response = await api.station.byId(3)

    expect(response.id).toBe(3)
    expect(response.internalId).toEqual(expect.any(String))
    expect(response.finName).toEqual('Kapteeninpuistikko')
    expect(response.finAddress).toEqual('Tehtaankatu 13')
    expect(response.x).toEqual(expect.any(Number))
    expect(response.y).toEqual(expect.any(Number))
  })

  it('byIdFilteredByMonth should correct data for station 3', async () => {
    const response = await api.station.byIdFilteredByMonth({
      id: 3,
      month: 6
    })

    expect(response.starting).toEqual(expect.any(Number))
    expect(response.ending).toEqual(expect.any(Number))
    expect(response.monthName).toBe('June')
    expect(response.month).toBe(6)
    expect(response.endingAt).toBeArrayOfSize(5)
    expect(response.startingFrom).toBeArrayOfSize(5)
  })

  it('byIdFilteredByMonth should return error with nonexistent station', async () => {
    const response = await getError(async () =>
      api.station.byIdFilteredByMonth({
        id: nonexistentId,
        month: 6
      })
    )

    expect(response).toBeInstanceOf(NoErrorThrownError)
  })

  it('getAllMapPoints should return correct data', async () => {
    const response = await api.station.getAllMapPoints()

    expect(response).toBeArray()

    expect(response[0]).toEqual({
      id: expect.any(Number),
      finName: expect.any(String),
      sweName: expect.any(String),
      x: expect.any(Number),
      y: expect.any(Number)
    })
  })

  it('getAll should return correct data', async () => {
    const response = await api.station.getAll({
      take: 21
    })

    expect(response).toBeArray()
    expect(response).toBeArrayOfSize(21)

    expect(response[0]).toEqual({
      id: expect.any(Number),
      internalId: expect.any(String),
      finName: expect.any(String),
      sweName: expect.any(String),
      finAddress: expect.any(String),
      sweAddress: expect.any(String),
      capacity: expect.any(Number),
      sweCity: expect.any(String),
      operator: expect.any(String),
      finCity: expect.any(String),
      x: expect.any(Number),
      y: expect.any(Number)
    })
  })
})
