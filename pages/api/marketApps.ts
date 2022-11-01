import type { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '../../lib/database.types';
import { createClient } from '@supabase/supabase-js'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const supabase = useSupabaseClient();
  
  // const apps = await supabase.from('MarketApp').select('*');
  // console.log(apps);
  // res.status(200).json(apps['data'])

  res.status(200).json([])
}
