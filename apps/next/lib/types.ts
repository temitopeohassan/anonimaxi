export interface Cast {
  hash: string
  text: string
  author: {
    username: string
    pfp_url: string
  }
  timestamp?: number
  replies?: number
  reactions?: number
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

