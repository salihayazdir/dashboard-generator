import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

type Props = {
  previousMessages?: ChatCompletionMessageParam[];
  userPrompt: string;
  schema: string;
};

export const generateGptResponse = async ({
  userPrompt,
  schema,
  previousMessages,
}: Props) => {
  const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 20 * 1000,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      stream: false,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `
               User will write a prompt and you will generate an SQL query for it.
               Use the PostgreSQL database scmema JSON object between the triple quotes to generate the query:
                      """ ${schema} """
              Use short, meaningful aliases for column names.
              If the prompt is in Turkish, use Turkish aliases for column names.
              If employee names are included, give first name and last name in single column and name it "Name" or "İsim" for Turkish.
              Your response should be a JSON object which has properties of "query", "message" and "title".
              "query" property should be the SQL query you generated. Do not use line breaks in the query.
              "message" property should be the message you want to send to the user. Reply in Turkish if the user prompt is in Turkish.
              "title" property should be the short title of the result data table created by your query.
              When writing response messages, say you generated an element, not an SQL query. (do not translate the word "element" to "eleman" for Turkish. use "element").
          `,
        },
        ...(previousMessages || []),
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 1000,
    });

    console.log(completion?.choices[0]?.message?.content);

    const response = JSON.parse(
      completion?.choices[0]?.message?.content || '{}'
    );

    console.log('//// gpt response ', response);
    const { query, message, title } = response;

    if (!query) throw new Error('Sorgu oluşturulamadı.');

    return { query, message, title };
  } catch (err: any) {
    console.log(err);
    throw new Error('Sorgu oluşturulamadı.');
  }
};
