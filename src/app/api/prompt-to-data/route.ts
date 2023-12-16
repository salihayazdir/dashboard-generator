import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { pool } from '@/lib/pgPool';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions.mjs';
import { getSchemaQuery } from '@/lib/getSchemaQuery';

export async function POST(req: Request) {
  try {
    const { prompt: userPrompt, dataSourceId } = await req.json();

    const openai = new OpenAI({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const dataSource = await prisma.dataSource.findUnique({
      where: {
        id: dataSourceId,
      },
    });

    let schema = '';

    if (dataSource?.schema) {
      schema = dataSource.schema;
    } else {
      const client = await pool.connect();
      const getSchemaQueryResult = await client.query(getSchemaQuery);
      schema = JSON.stringify(
        getSchemaQueryResult.rows.filter(
          (row) =>
            !(row.table_name.includes('pg_') || row.table_name.includes('sql_'))
        )
      );
      client.release();

      await prisma.dataSource.update({
        where: {
          id: 1,
        },
        data: {
          schema: JSON.stringify(schema),
        },
      });
    }

    const aiPrompt = `
    given this postgresql database:
    ${schema}
    write an sql query for this request:
    ${userPrompt}.
    reply with only the sql query.
    use short, meaningful aliases for column names. if the prompt is in Turkish, use Turkish aliases.
    dont use any quotes or line breaks.
    if employee names are included, give first name and last name in single column and name it "Name" or "İsim" for Turkish.
    list maximum 10 if not specified otherwise.
    if you can not generate a valid query, just return "false"`;

    const generateSql = async (dbError?: string, faultySql?: string) => {
      const completionOptions: ChatCompletionCreateParamsNonStreaming =
        !dbError || !faultySql
          ? {
              model: 'gpt-4',
              messages: [
                {
                  role: 'user',
                  content: aiPrompt,
                },
              ],
              max_tokens: 1000,
            }
          : {
              model: 'gpt-4',
              messages: [
                {
                  role: 'user',
                  content: aiPrompt,
                },
                {
                  role: 'assistant',
                  content: faultySql,
                },
                {
                  role: 'user',
                  content: `SQL query you generated returned the following error: ${dbError}. Please try again.`,
                },
              ],
              max_tokens: 1000,
            };

      const completion = await openai.chat.completions.create(
        completionOptions
      );

      const response = completion?.choices[0]?.message?.content;

      if (typeof response === 'string') return response;
      return false;
    };

    // const sql =
    //   'SELECT fname AS FirstName, lname AS LastName, salary AS Salary FROM employee;';

    let tries = 0;
    let responseData = [];

    let sql: string | false = false;
    let dbError: string | undefined = undefined;

    const _try = async () => {
      try {
        if (tries > 2)
          return NextResponse.json(
            { error: 'Bir hata meydana geldi.', query: sql },
            { status: 400 }
          );
        tries++;
        const faultySql = sql ? sql : undefined;
        sql = await generateSql(dbError, faultySql);

        const client = await pool.connect();
        if (!sql)
          return NextResponse.json(
            { error: 'SQL sorgusu oluşturulamadı.' },
            { status: 400 }
          );

        const dbResult = await client.query(sql);
        client.release();

        if (dbResult.rows.length === 0)
          throw "Query didn't return any results.";
        responseData = dbResult.rows;

        return NextResponse.json({ result: responseData, query: sql });
      } catch (err) {
        dbError = err as string;
        await _try();
      }
    };

    return await _try();
  } catch (err) {
    return NextResponse.json({ error: err, query: '' }, { status: 400 });
  }
}
