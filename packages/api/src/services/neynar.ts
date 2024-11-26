import crypto from 'crypto'
import { getPostMapping, getSignerForAddress } from '@anon/db'
import {
  CreatePostParams,
  GetBulkCastsResponse,
  GetCastResponse,
  GetCastsResponse,
  GetChannelResponse,
  PostCastResponse,
  SubmitHashParams,
} from './types'
import Redis from 'ioredis'
import { twitterClient } from './twitter'

const redis = new Redis(process.env.REDIS_URL as string)

class NeynarService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.neynar.com/v2'
  private static instance: NeynarService

  private constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  static getInstance(): NeynarService {
    if (!NeynarService.instance) {
      const apiKey = process.env.NEYNAR_API_KEY
      if (!apiKey) {
        throw new Error('NEYNAR_API_KEY environment variable is not set')
      }
      NeynarService.instance = new NeynarService(apiKey)
    }
    return NeynarService.instance
  }

  private async makeRequest<T>(
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'DELETE'
      maxRetries?: number
      retryDelay?: number
      body?: string
    }
  ): Promise<T> {
    const { maxRetries = 1, retryDelay = 10000, method, body } = options ?? {}
    let retries = 0

    while (retries < maxRetries) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-KEY': this.apiKey,
      }
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        method,
        body,
      })

      if (response.status === 202 && maxRetries > 1) {
        retries++
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        continue
      }

      if (!response.ok) {
        console.error(await response.text())
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    }

    throw new Error('Maximum retries reached while waiting for data')
  }

  async validateFrame(message_bytes_in_hex: string) {
    return this.makeRequest<{ valid: boolean }>('/farcaster/frame/validate', {
      method: 'POST',
      body: JSON.stringify({ message_bytes_in_hex }),
    })
  }

  async getCast(hash: string) {
    return this.makeRequest<GetCastResponse>(
      `/farcaster/cast?type=${hash.startsWith('0x') ? 'hash' : 'url'}&identifier=${hash}`
    )
  }

  async getChannel(identifier: string) {
    return this.makeRequest<GetChannelResponse>(
      `/farcaster/channel?id=${identifier}&type=id`
    )
  }

  async getUserCasts(fid: number) {
    return this.makeRequest<GetCastsResponse>(
      `/farcaster/feed/user/casts?limit=150&include_replies=true&fid=${fid}`
    )
  }

  async getBulkCasts(hashes: string[]) {
    return this.makeRequest<GetBulkCastsResponse>(
      `/farcaster/casts?casts=${hashes.join(',')}`
    )
  }

  async post(params: CreatePostParams) {
    const signerUuid = await getSignerForAddress(params.tokenAddress)

    const embeds: Array<{
      url?: string
      castId?: { hash: string; fid: number }
    }> = params.embeds.map((embed) => ({
      url: embed,
    }))

    if (params.quote) {
      const quote = await this.getCast(params.quote)
      embeds.push({
        castId: {
          hash: quote.cast.hash,
          fid: quote.cast.author.fid,
        },
      })
    }

    let parentAuthorFid = undefined
    if (params.parent) {
      const parent = await this.getCast(params.parent)
      parentAuthorFid = parent.cast.author.fid
    }

    const body = {
      signer_uuid: signerUuid.signerUuid,
      parent: params.parent,
      parent_author_fid: parentAuthorFid,
      text: params.text,
      embeds,
      channel_id: params.channel,
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex')

    const exists = await redis.get(`post:hash:${hash}`)
    if (exists) {
      return {
        success: false,
      }
    }

    const response = await this.makeRequest<PostCastResponse>('/farcaster/cast', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    if (!response.success) {
      return {
        success: false,
      }
    }

    await redis.set(`post:hash:${hash}`, 'true', 'EX', 60 * 5)

    return response
  }

  async delete(params: SubmitHashParams) {
    const signerUuid = await getSignerForAddress(params.tokenAddress)
    const cast = await this.getCast(params.hash)
    if (!cast.cast) {
      return {
        success: false,
      }
    }

    if (new Date(cast.cast.timestamp).getTime() < Date.now() - 10800 * 1000) {
      return {
        success: false,
      }
    }

    await this.makeRequest('/farcaster/cast', {
      method: 'DELETE',
      body: JSON.stringify({
        signer_uuid: signerUuid.signerUuid,
        target_hash: params.hash,
      }),
    })

    const postMapping = await getPostMapping(params.hash)
    if (postMapping) {
      await twitterClient.v2.deleteTweet(postMapping.tweetId)
    }

    return {
      success: true,
    }
  }
}

export const neynar = NeynarService.getInstance()
