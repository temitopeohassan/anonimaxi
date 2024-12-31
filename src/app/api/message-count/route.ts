import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    if (!process.env.NEYNAR_API_KEY) {
      throw new Error('NEYNAR_API_KEY not set');
    }

    // Get the connected wallet address from the request
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      throw new Error('No wallet address provided');
    }

    // Using the correct Neynar API endpoint for fetching messages
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/casts?filter=replies&with_recasts=false&limit=50`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Neynar API Error:', errorText);
      throw new Error(`Failed to fetch message count: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Filter messages by the connected wallet address
    const userMessages = data.result?.casts?.filter(
      (cast: any) => cast.author?.verified_addresses?.includes(address.toLowerCase())
    ) || [];

    return NextResponse.json({ 
      count: userMessages.length,
      success: true 
    });

  } catch (error) {
    console.error('Error fetching message count:', error);
    return NextResponse.json({ 
      count: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 