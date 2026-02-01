import { Pool, type QueryResultRow } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
) {
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
