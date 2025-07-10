import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { DocumentProcessorServiceClient } from '@google-cloud/documentai'
import fs from 'node:fs/promises'

type ProcessFileResponse = Awaited<ReturnType<typeof DocumentAIService.processFile>>
type ProcessedDocument = ProcessFileResponse['document']

export interface ExtractOCRDataResponse {
  firstName?: string | null
  lastName?: string | null
  cnp?: string | null
  address?: string | null
  validity?: string | null
}

export default class DocumentAIService {
  private static instance: DocumentProcessorServiceClient

  private constructor() {}

  public static getInstance(): DocumentProcessorServiceClient {
    if (!DocumentAIService.instance) {
      const credentials = JSON.parse(env.get('DOCUMENTAI_CREDENTIALS'))
      DocumentAIService.instance = new DocumentProcessorServiceClient({
        credentials,
        apiEndpoint: 'eu-documentai.googleapis.com',
      })
    }

    return DocumentAIService.instance
  }

  public static getProjectName() {
    const projectId = env.get('DOCUMENTAI_PROJECT_ID')
    const location = env.get('DOCUMENTAI_LOCATION')
    const processorId = env.get('DOCUMENTAI_PROCESSOR_ID')
    const versionId = env.get('DOCUMENTAI_VERSION_ID')

    return `projects/${projectId}/locations/${location}/processors/${processorId}/processorVersions/${versionId}`
  }

  public static async processFile(file: MultipartFile) {
    if (!file.tmpPath) throw new Error('File tmpPath is missing.')

    const filePath = app.makePath(file.tmpPath)
    const fileContent = await fs.readFile(filePath)
    const base64Content = fileContent.toString('base64')
    const mimeType = file.headers['content-type']

    const client = DocumentAIService.getInstance()
    const projectName = DocumentAIService.getProjectName()

    const res = await client.processDocument({
      name: projectName,
      rawDocument: {
        content: base64Content,
        mimeType,
      },
    })

    const [result] = res

    return result
  }

  private static findOCRResult(document: ProcessedDocument, type: string) {
    if (!document?.entities) return null

    return document.entities.find((entity) => entity.type === type)
  }

  private static getOCRResultContent(document: ProcessedDocument, type: string) {
    const result = DocumentAIService.findOCRResult(document, type)

    return result?.mentionText || ''
  }

  public static async extractOCRData(file: MultipartFile): Promise<ExtractOCRDataResponse> {
    const { document } = await DocumentAIService.processFile(file)

    if (!document)
      return { address: null, cnp: null, firstName: null, lastName: null, validity: null }

    const cnp = DocumentAIService.getOCRResultContent(document, 'cnp')
    const address = DocumentAIService.getOCRResultContent(document, 'address')
    const firstName = DocumentAIService.getOCRResultContent(document, 'first_name')
    const lastName = DocumentAIService.getOCRResultContent(document, 'last_name')
    const validity = DocumentAIService.getOCRResultContent(document, 'validity')

    return { cnp, address, firstName, lastName, validity }
  }
}
