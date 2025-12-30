import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data'
import { IncomingForm, File } from 'formidable'
import fs from 'fs'

import { API_ENDPOINT } from '~/constants/config'

// Disable Next.js body parsing - we need to handle multipart form data ourselves
export const config = {
  api: {
    bodyParser: false,
  },
}

type ResponseData = {
  success: boolean
  photoId?: string
  error?: string
}

// Parse the incoming form data
const parseForm = (
  req: NextApiRequest
): Promise<{
  fields: Record<string, unknown>
  files: Record<string, File[] | undefined>
}> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ fields, files })
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Parse the multipart form data
    const { fields, files } = await parseForm(req)

    const imageFiles = files.file
    const file = imageFiles?.[0]

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    const nameField = fields.name
    const name = Array.isArray(nameField) ? nameField[0] : nameField
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Name is required' })
    }

    // Create FormData for the GraphQL mutation
    const formData = new FormData()

    // GraphQL multipart request spec:
    // https://github.com/jaydenseric/graphql-multipart-request-spec
    const operations = JSON.stringify({
      query: `
        mutation CreatePhoto($data: PhotoCreateInput!) {
          createPhoto(data: $data) {
            id
          }
        }
      `,
      variables: {
        data: {
          name,
          imageFile: {
            upload: null, // Will be replaced by the map
          },
        },
      },
    })

    const map = JSON.stringify({
      '0': ['variables.data.imageFile.upload'],
    })

    formData.append('operations', operations)
    formData.append('map', map)
    formData.append('0', fs.createReadStream(file.filepath), {
      filename: file.originalFilename || 'avatar.jpg',
      contentType: file.mimetype || 'image/jpeg',
    })

    // Send the request to the GraphQL API using form-data's submit
    const response = await new Promise<{ statusCode: number; body: string }>(
      (resolve, reject) => {
        formData.submit(
          {
            protocol: 'https:',
            host: new URL(API_ENDPOINT).host,
            path: new URL(API_ENDPOINT).pathname,
            method: 'POST',
            headers: {
              'Apollo-Require-Preflight': 'true',
            },
          },
          (err, res) => {
            if (err) {
              reject(err)
              return
            }
            let body = ''
            res.on('data', (chunk) => {
              body += chunk
            })
            res.on('end', () => {
              resolve({ statusCode: res.statusCode || 500, body })
            })
            res.on('error', reject)
          }
        )
      }
    )

    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.error('GraphQL API error:', response.statusCode, response.body)
      return res.status(response.statusCode).json({
        success: false,
        error: `Upload failed: ${response.statusCode}`,
      })
    }

    const result = JSON.parse(response.body) as {
      data?: { createPhoto?: { id: string } }
      errors?: Array<{ message: string }>
    }

    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL errors:', result.errors)
      return res.status(400).json({
        success: false,
        error: result.errors[0].message,
      })
    }

    const photoId = result.data?.createPhoto?.id
    if (!photoId) {
      return res.status(500).json({
        success: false,
        error: 'No photo ID returned from server',
      })
    }

    // Clean up the temporary file
    fs.unlink(file.filepath, () => {})

    return res.status(200).json({ success: true, photoId })
  } catch (error) {
    console.error('Upload handler error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
