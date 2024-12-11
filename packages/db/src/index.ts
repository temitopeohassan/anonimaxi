import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { postMappingTable, signersTable } from './db/schema'
import { eq } from 'drizzle-orm'

console.log('Attempting database connection...')
const db = drizzle(process.env.DATABASE_URL as string)
console.log('Database connection established')

export async function getSignerForAddress(address: string) {
  console.log('Getting signer for address:', address)
  try {
    const [user] = await db
      .select()
      .from(signersTable)
      .where(eq(signersTable.address, address))
      .limit(1)
    console.log('Found signer:', user)
    return user
  } catch (error) {
    console.error('Error getting signer:', error)
    throw error
  }
}

export async function createSignerForAddress(address: string, signerUuid: string) {
  console.log('Creating signer for address:', address, 'with UUID:', signerUuid)
  try {
    const [user] = await db
      .insert(signersTable)
      .values({ address, signerUuid })
      .onConflictDoUpdate({ target: signersTable.address, set: { signerUuid } })
      .returning()
    console.log('Created/updated signer:', user)
    return user
  } catch (error) {
    console.error('Error creating signer:', error)
    throw error
  }
}

export async function createPostMapping(castHash: string, tweetId: string) {
  console.log('Creating post mapping:', { castHash, tweetId })
  try {
    await db.insert(postMappingTable).values({ castHash, tweetId }).onConflictDoNothing()
    console.log('Post mapping created successfully')
  } catch (error) {
    console.error('Error creating post mapping:', error)
    throw error
  }
}

export async function getPostMapping(castHash: string) {
  console.log('Getting post mapping for cast hash:', castHash)
  try {
    const [row] = await db
      .select()
      .from(postMappingTable)
      .where(eq(postMappingTable.castHash, castHash))
      .limit(1)
    console.log('Found post mapping:', row)
    return row
  } catch (error) {
    console.error('Error getting post mapping:', error)
    throw error
  }
}
