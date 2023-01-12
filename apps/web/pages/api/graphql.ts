import { createYoga, createSchema } from "graphql-yoga"
import { NextApiRequest, NextApiResponse } from "next"
import "reflect-metadata"

import {
  Arg,
  Args,
  ArgsType,
  buildSchema,
  Field,
  ID,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"

import { prisma } from "@citybiker/db"
import { FindManyJourneyArgs, Journey } from "../../generated/type-graphql"
import { Max, MaxLength, Min, MinLength } from "class-validator"
// import { Journey } from "../../generated/type-graphql"

// @ObjectType()
// class Journey {
//   @Field((type) => ID)
//   id: string
// }

@ArgsType()
class FindManyJourneyArgsWithMin extends FindManyJourneyArgs {
  @Field()
  @Max(50)
  @Min(1)
  take: number
}

@Resolver(Journey)
class JourneyResolver {
  // constructor(private JourneyService: JourneyService) {}

  @Query((returns) => Journey)
  async journey(@Arg("id") id: string) {
    const journey = await prisma.journey.findFirst({
      where: {
        id: id,
      },
    })
    if (journey === null) {
      throw new Error("Journey not found by id")
    }
    return journey
  }

  @Query((returns) => [Journey])
  async journeys(
    @Args()
    { take }: FindManyJourneyArgsWithMin
  ) {
    const journeys = await prisma.journey.findMany({ take })

    return journeys
  }
}

export const graphqlSchema = buildSchema({
  resolvers: [JourneyResolver],
  validate: true,
})

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema: graphqlSchema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
})
