import { NextResponse } from 'next/server';
import neynarClient from "@/lib/neynarClient";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    console.log('Received request:', { text });

    if (!process.env.NEYNAR_API_KEY) {
      console.error('NEYNAR_API_KEY not set');
      throw new Error('NEYNAR_API_KEY is not set');
    }

    if (!process.env.SIGNER_UUID) {
      console.error('SIGNER_UUID not set');
      throw new Error('SIGNER_UUID is not set');
    }

    try {
      // Create the cast using direct API call with signer_uuid from env
      const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
        },
        body: JSON.stringify({
          signer_uuid: process.env.SIGNER_UUID,
          text: text,
          embeds: [],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Neynar API Error Response:', errorText);
        throw new Error(`Neynar API error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Cast response:', result);

      return NextResponse.json(result);
    } catch (apiError) {
      console.error('Neynar API Error:', apiError);
      return NextResponse.json(
        { error: apiError instanceof Error ? apiError.message : 'Failed to publish cast to Neynar' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating cast:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create cast' },
      { status: 500 }
    );
  }
}
