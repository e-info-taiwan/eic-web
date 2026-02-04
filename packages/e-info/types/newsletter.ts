// Newsletter subscription API types

export type NewsletterFrequency = 'daily' | 'weekly'
export type NewsletterFormat = 'standard' | 'styled'

export type SubscribeRequest = {
  email: string
  frequency: NewsletterFrequency
  format: NewsletterFormat
}

export type SubscribeResponse = {
  success: boolean
  message?: string
  error?: string
}

// Mailchimp-related types
export type MailchimpMemberStatus =
  | 'subscribed'
  | 'unsubscribed'
  | 'cleaned'
  | 'pending'
  | 'transactional'

export type MailchimpTag = {
  name: string
  status: 'active' | 'inactive'
}

export type MailchimpMemberData = {
  email_address: string
  status: MailchimpMemberStatus
  tags?: string[]
  merge_fields?: Record<string, string>
}

export type MailchimpErrorResponse = {
  type: string
  title: string
  status: number
  detail: string
  instance: string
}
