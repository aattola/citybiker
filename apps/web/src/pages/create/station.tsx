import React from 'react'
import { Button, Input } from '@chakra-ui/react'
import { stationParser } from '@citybiker/db/src/parsers'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { api } from '../../utils/api'

const parser = stationParser.omit({
  id: true,
  sweName: true,
  sweAddress: true,
  sweCity: true
})

type FormValues = z.infer<typeof parser>

const CreateStation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(parser)
  })
  const router = useRouter()

  const mutation = api.station.create.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    const result = await mutation.mutateAsync(data)

    await router.push(`/station/${result.id}`)
  })

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Create station</h1>

        <Input
          placeholder="Name"
          isInvalid={!!errors.finName}
          {...register('finName', { required: true })}
        />
        {errors.finName?.message && <p>{errors.finName.message}</p>}

        <Input
          placeholder="Address"
          isInvalid={!!errors.finAddress}
          {...register('finAddress', { required: true })}
        />
        {errors.finAddress?.message && <p>{errors.finAddress.message}</p>}

        <Input
          placeholder="City"
          isInvalid={!!errors.finCity}
          {...register('finCity', { required: true })}
        />
        {errors.finCity?.message && <p>{errors.finCity.message}</p>}

        <Input
          placeholder="Operator"
          isInvalid={!!errors.operator}
          {...register('operator', { required: true })}
        />
        {errors.operator?.message && <p>{errors.operator.message}</p>}

        <Input
          type="number"
          placeholder="Capacity"
          isInvalid={!!errors.capacity}
          {...register('capacity', { valueAsNumber: true, required: true })}
        />
        {errors.capacity?.message && <p>{errors.capacity.message}</p>}

        <Input
          type="number"
          placeholder="X"
          isInvalid={!!errors.x}
          {...register('x', { valueAsNumber: true, required: true })}
        />
        {errors.x?.message && <p>{errors.x.message}</p>}

        <Input
          type="number"
          placeholder="Y"
          isInvalid={!!errors.y}
          {...register('y', { valueAsNumber: true, required: true })}
        />
        {errors.y?.message && <p>{errors.y.message}</p>}

        <Button isLoading={mutation.isLoading} type="submit">
          Create
        </Button>

        {mutation.isError && <p>{mutation.error.message}</p>}
      </form>
    </div>
  )
}

export default CreateStation
