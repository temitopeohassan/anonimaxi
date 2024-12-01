export interface Cast {
  hash: string
  text: string
  author: {
    username: string
    pfp_url: string
  }
  timestamp: string
  replies: {
    count: number
  }
  reactions: {
    likes_count: number
    recasts_count: number
  }
  embeds: Array<{
    url: string
    metadata?: {
      image?: boolean
      html?: {
        ogImage?: Array<{
          url: string
          alt?: string
        }>
        ogTitle?: string
        ogDescription?: string
      }
    }
    cast?: Cast
  }>
}

export interface Channel {
  id: string
  name: string
  image_url: string
}

export interface GetCastsResponse {
  casts: Cast[]
}

export interface PostCastResponse {
  success: boolean
  hash?: string
}

export interface ValidateFrameResponse {
  action: {
    interactor: {
      verified_addresses: {
        eth_addresses: string[]
      }
    }
  }
}

export interface ActionPayload {
  trustedData: {
    messageBytes: string
  }
}

