import { Pool, type QueryResultRow, type QueryResult } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

const isSupabase = DATABASE_URL?.includes('supabase.com') || DATABASE_URL?.includes('supabase.co')

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: isSupabase || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult<T>> {
  if (!pool) {
    return { rows: [], rowCount: 0, command: '', oid: 0, fields: [] }
  }

  const client = await pool.connect()
  try {
    await client.query('SET search_path TO website, public')
    const result = await client.query<T>(text, params)
    return result
  } finally {
    client.release()
  }
}

export default pool
