import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '../auth/[...nextauth]/options';
import { executeQueryOnDataSource } from '@/lib/executeQueryOnDataSource';
import { generateGptResponse } from './generateGptResponse';

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

    // Yetki kontrolü
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Kullanıcı bulunamadı.');
    if (Number(session.user.id) !== ownerId)
      throw new Error('Bu veri kaynağına erişim izniniz bulunmuyor.');

    // chat gpt ile sql sorgusu oluşturulur
    // let query = await generateQuery({ userPrompt, schema });
    const { query, message, title } = await generateGptResponse({
      userPrompt,
      schema,
      previousMessages: previousMessages
        ? previousMessages?.map((m: any) => {
            if (m.role === 'user') {
              return {
                role: m.role,
                content: m.message,
              };
            } else {
              return {
                role: m.role,
                content: JSON.stringify({
                  query: m.query,
                  message: m.message,
                }),
              };
            }
          })
        : undefined,
    });

    // oluşturulan sorgu çalıştırılır
    const result = await executeQueryOnDataSource({ connectionString, query });

    return NextResponse.json({ result, query, message, title });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err?.message ? err?.message : 'Bir hata meydana geldi.',
        query: '',
      },
      { status: 400 }
    );
  }
}
