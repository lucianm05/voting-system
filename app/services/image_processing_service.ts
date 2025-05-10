import { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import scribe from 'scribe.js-ocr'
import tesseract from 'tesseract.js'

export default class ImageProcessingService {
  file: MultipartFile | null

  constructor(file: MultipartFile) {
    this.file = file
  }

  public async OCR(languages = ['ron']) {
    if (!this.file?.tmpPath) {
      throw new Error('filePath is missing')
    }

    const imagePath = app.makePath(this.file.tmpPath)
    const worker = await tesseract.createWorker(languages, 1, {})
    const { data: tesseractData } = await worker.recognize(imagePath)
    await worker.terminate()

    const scribeData = await scribe.extractText([imagePath])
    await scribe.terminate()

    return { tesseractData, scribeData }
  }
}
