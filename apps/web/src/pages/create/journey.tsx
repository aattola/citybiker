import React from 'react'
import { Button, Heading, Input, Stack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { journeyCreateParser } from '@citybiker/api/src/router/journey/create'
import { DateTimePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

import { api } from '../../utils/api'

const journeyClientParser = journeyCreateParser.omit({
  return: true,
  departure: true
})

type FormValues = z.infer<typeof journeyClientParser>

const CreateJourney = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(journeyClientParser)
  })
  const router = useRouter()

  const [departureTime, setDeparture] = React.useState<Dayjs | null>(
    dayjs().subtract(1, 'hour')
  )

  const [returnTime, setReturn] = React.useState<Dayjs | null>(dayjs())

  const handleDepartureChange = (newValue: Dayjs | null) => {
    setDeparture(newValue)
  }

  const handleReturnChange = (newValue: Dayjs | null) => {
    setReturn(newValue)
  }

  const mutation = api.journey.create.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    const departure = departureTime?.toDate()
    const returnT = returnTime?.toDate()

    if (!departure || !returnT) {
      return
    }

    if (departure.getUTCSeconds() > returnT.getUTCSeconds()) {
      return
    }

    const result = await mutation.mutateAsync({
      ...data,
      departure,
      return: returnT
    })

    await router.push(`/journeys/?id=${result.id}`)
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-2xl m-auto my-4">
        <form onSubmit={onSubmit}>
          <Stack mt="6" spacing="3">
            <Heading size="md" py={1}>
              Create journey
            </Heading>

            <div>
              <Input
                placeholder="Departure station id"
                isInvalid={!!errors.departureStationId}
                {...register('departureStationId', {
                  valueAsNumber: true,
                  required: true
                })}
              />
              {errors.departureStationId?.message && (
                <p>{errors.departureStationId.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Return station id"
                isInvalid={!!errors.returnStationId}
                {...register('returnStationId', {
                  valueAsNumber: true,
                  required: true
                })}
              />
              {errors.returnStationId?.message && (
                <p>{errors.returnStationId.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Duration of the trip in minutes"
                isInvalid={!!errors.duration}
                {...register('duration', {
                  valueAsNumber: true,
                  required: true
                })}
              />
              {errors.duration?.message && <p>{errors.duration.message}</p>}
            </div>

            <div>
              <Input
                placeholder="Distance of the trip in meters"
                isInvalid={!!errors.coveredDistance}
                {...register('coveredDistance', {
                  valueAsNumber: true,
                  required: true
                })}
              />
              {errors.coveredDistance?.message && (
                <p>{errors.coveredDistance.message}</p>
              )}
            </div>

            <div>
              <DateTimePicker
                label="Departure time"
                value={departureTime}
                onChange={handleDepartureChange}
                ampm={false}
                disableMaskedInput
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </div>

            <div>
              <DateTimePicker
                minDateTime={departureTime ?? undefined}
                label="Return time"
                value={returnTime}
                onChange={handleReturnChange}
                ampm={false}
                disableMaskedInput
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </div>

            <Button isLoading={mutation.isLoading} type="submit">
              Create
            </Button>

            {mutation.isError && <p>Error: {mutation.error.message}</p>}
          </Stack>
        </form>
      </div>
    </LocalizationProvider>
  )
}

export default CreateJourney
