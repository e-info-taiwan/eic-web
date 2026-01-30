import gql from 'graphql-tag'

export type Job = {
  id: string
  title: string
  company?: string
  jobDescription?: string
  requirements?: string
  salary?: string
  bonus?: string
  applicationMethod?: string
  startDate?: string
  endDate?: string
  isApproved?: boolean
  showOnHomepage?: boolean
  sortOrder?: number
  state?: string
  createdAt?: string
}

// Query for job list page
export const jobs = gql`
  query ($take: Int = 12, $skip: Int = 0) {
    jobs(
      take: $take
      skip: $skip
      where: { state: { equals: "published" }, isApproved: { equals: true } }
      orderBy: { createdAt: desc }
    ) {
      id
      title
      company
      jobDescription
      startDate
      endDate
      createdAt
    }
  }
`

// Query for job count
export const jobsCount = gql`
  query {
    jobsCount(
      where: { state: { equals: "published" }, isApproved: { equals: true } }
    )
  }
`

// Query for single job detail
export const jobById = gql`
  query ($id: ID!) {
    job(where: { id: $id }) {
      id
      title
      company
      jobDescription
      requirements
      salary
      bonus
      applicationMethod
      startDate
      endDate
      isApproved
      state
      createdAt
    }
  }
`

// Mutation for creating a new job (user submission)
export const createJob = gql`
  mutation CreateJob($data: JobCreateInput!) {
    createJob(data: $data) {
      id
      title
    }
  }
`
