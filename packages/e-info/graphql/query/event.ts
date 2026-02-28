import gql from 'graphql-tag'

import { resizeImagesFragment } from '~/graphql/fragments/resized-images'

export type Event = {
  id: string
  name: string
  heroImage?: {
    resized?: {
      original?: string
      w480?: string
      w800?: string
      w1200?: string
    }
  }
  organizer?: string
  contactInfo?: string
  eventType?: string
  city?: string
  startDate?: string
  endDate?: string
  location?: string
  fee?: string
  registrationUrl?: string
  content?: string
  isApproved?: boolean
  state?: string
}

// Query for event list page
const events = gql`
  query ($take: Int = 12, $skip: Int = 0) {
    events(
      take: $take
      skip: $skip
      where: { state: { equals: "published" }, isApproved: { equals: true } }
      orderBy: { startDate: desc }
    ) {
      id
      name
      heroImage {
        resized {
          ...ResizedImagesField
        }
      }
      organizer
      eventType
      city
      startDate
      endDate
      location
      fee
      registrationUrl
    }
  }
  ${resizeImagesFragment}
`

// Query for event count
const eventsCount = gql`
  query {
    eventsCount(
      where: { state: { equals: "published" }, isApproved: { equals: true } }
    )
  }
`

// Query for single event detail
const eventById = gql`
  query ($id: ID!) {
    event(where: { id: $id }) {
      id
      name
      heroImage {
        resized {
          ...ResizedImagesField
        }
      }
      organizer
      contactInfo
      eventType
      city
      startDate
      endDate
      location
      fee
      registrationUrl
      content
      isApproved
      state
    }
  }
  ${resizeImagesFragment}
`

// Mutation for creating a new event (user submission)
const createEvent = gql`
  mutation CreateEvent($data: EventCreateInput!) {
    createEvent(data: $data) {
      id
      name
    }
  }
`

export { createEvent, eventById, events, eventsCount }
