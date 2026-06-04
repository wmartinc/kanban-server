const {createClient} = require('@supabase/supabase-js')
require('dotenv/config')

const conexion = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);

module.exports = {
  conexion
}