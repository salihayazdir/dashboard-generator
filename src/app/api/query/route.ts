// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import { Configuration, OpenAI } from 'openai';
// import { Client } from 'pg';

// export async function POST(req: Request) {
//   const json = await req.json();

//   const userPrompt = json.prompt;

//   console.log('////////////////////// userPrompt //////////////////////');
//   console.log(userPrompt);
//   console.log('////////////////////// userPrompt //////////////////////');

//   const configuration = new Configuration({
//     organization: process.env.OPENAI_ORGANIZATION,
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const openai = new OpenAI(configuration);

//   const client = new Client({
//     connectionString: process.env.ELEPHANTSQL_CONN_STR,
//   });
//   await client.connect();

//   const getSchemaQuery = `SELECT c.relname AS table_name,
//   a.attname AS column_name,
//   pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
//   FROM pg_catalog.pg_class c
//   JOIN pg_catalog.pg_attribute a
//   ON a.attrelid = c.oid
//   WHERE c.relkind = 'r'
//   AND a.attnum > 0
//   AND NOT a.attisdropped
//   ORDER BY c.relname, a.attnum;`;

//   const getSchemaQueryResult = await client.query(getSchemaQuery);
//   // console.log(getSchemaQueryResult.rows);

//   const schema = getSchemaQueryResult.rows.filter(
//     (row) =>
//       !(row.table_name.includes('pg_') || row.table_name.includes('sql_'))
//   );

//   const aiPrompt = `
//   given this postgresql database:
//   ${JSON.stringify(schema)}
//   write an sql query for this request:
//   ${userPrompt}.
//   reply with only the sql query.
//   use meaningful aliases for column names.
//   if you can not generate a valid query, just return "false"`;

//   const aiResponse = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: aiPrompt,
//     max_tokens: 500,
//     temperature: 0,
//   });

//   const aiQuery: string = `${aiResponse.data.choices[0].text}`;

//   console.log('////////////////////// AI QUERY //////////////////////');
//   console.log(aiQuery);
//   console.log('////////////////////// AI QUERY //////////////////////');

//   if (aiQuery === 'false')
//     return NextResponse.json({ error: 'An error occured.' });

//   const finalQueryResult = await client.query(aiQuery);
//   client.end();

//   return NextResponse.json(finalQueryResult.rows);
// }
