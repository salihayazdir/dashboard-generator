import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '../auth/[...nextauth]/options';
import { executeQueryOnDataSource } from '@/lib/executeQueryOnDataSource';

export async function POST(req: Request) {
  try {
    const {
      prompt: userPrompt,
      dataSourceId,
      previousMessages,
    } = await req.json();

    const dataSource = await prisma.dataSource.findUnique({
      where: {
        id: dataSourceId,
      },
    });
    if (!dataSource) throw new Error('Veri kaynağı bulunamadı.');

    const { schema, connectionString, ownerId } = dataSource;

    const query = `SELECT E.fname || ' ' || E.lname AS Name, E.salary, COUNT(W.pno) AS Project_Count 
    FROM employee E JOIN works_on W on E.ssn = W.essn 
    GROUP BY E.fname, E.lname, E.salary 
    ORDER BY E.salary DESC, COUNT(W.pno) DESC `;

    const message =
      'I generated a query for you. I generated a query for you. I generated a query for you.';
    const title = 'test title';

    // oluşturulan sorgu çalıştırılır
    const result = await executeQueryOnDataSource({ connectionString, query });

    return NextResponse.json({ result, query, message, title });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { error: err?.message, query: '' },
      { status: 400 }
    );
  }
}
