import { ActionPayload } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json({
      success: false,
    })
  }

  const data: ActionPayload = await request.json()
  const redirectUrl = `${decodeURIComponent(url)}?data=${data.trustedData.messageBytes}`

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
    },
  })
}
