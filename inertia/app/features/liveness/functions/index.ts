import * as faceapi from 'face-api.js'

const MODEL_URL = '/face_api_models'

/**
 * Loads the needed `faceapi.js` models needed to detect the face and movements.
 */
export async function loadFaceApi() {
  return await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
  ])
}

export function initFaceApiOptions() {
  return new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
}

/**
 * Based on the video stream, detects the face of the user with landmarks (eyes/nose/mouth/etc.).
 */
export async function detectFaceWithLandmarks(video: HTMLVideoElement) {
  return await faceapi.detectSingleFace(video, initFaceApiOptions()).withFaceLandmarks(true)
}
