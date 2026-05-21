import { pipeline } from '@huggingface/transformers'
import { RequestItem } from '../types'

let extractorPromise: Promise<any> | null = null

export function getEmbeddingKey(
  requestId: number,
): string {
  return `embedding:request:${requestId}`
}

export function buildRequestText(request: RequestItem): string {
  return `
    ${request.title}
    ${request.description}
    ${request.threat_type?.name || ''}
  `
}

export async function getOrCreateEmbedding(request: RequestItem): Promise<number[]> {
  const key = getEmbeddingKey(request.id)

  const cached = localStorage.getItem(key)

  if (cached) {
    try {
      const parsed = JSON.parse(cached)

      if (
        parsed?.embedding &&
        Array.isArray(parsed.embedding,)
      ) {
        return parsed.embedding
      }
    } catch {
      localStorage.removeItem(key)
    }
  }

  const embedding =
    await createEmbedding(buildRequestText(request),)

  localStorage.setItem(
    key,
    JSON.stringify({
      version: 1,
      requestId: request.id,
      embedding,
    }),
  )

  return embedding
}



export async function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    )
  }

  return extractorPromise
}

export async function createEmbedding(text: string,): Promise<number[]> {
  const extractor = await getExtractor()

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(output.data)
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}
