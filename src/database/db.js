import 'dotenv/config'

import { Pool } from "pg";

const pool = new Pool({
    user: process.env.DB_USER  || 'roger',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tmapi_db',
    password: process.env.DB_PASSWORD ,
    port: process.env.DB_PORT,
})

export default pool