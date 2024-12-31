export interface Cast {
  hash: string;
  text: string;
  timestamp: number;
}

export interface Channel {
  id: string;
  name: string;
}

export interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
} 