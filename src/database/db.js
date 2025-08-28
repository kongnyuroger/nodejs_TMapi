import { Pool } from "pg";

const pool = new Pool({
    user: 'roger',
    host: 'localhost',
    database: 'tmapi_db',
    password: '1234',
    port: 5432
})

export default pool