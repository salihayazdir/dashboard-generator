import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = [
    { name: 'Evan Wallis', salary: 92000, project_count: '1' },
    { name: 'Alex Freed', salary: 89000, project_count: '1' },
    { name: 'Jared James', salary: 85000, project_count: '1' },
    { name: 'John James', salary: 81000, project_count: '1' },
    { name: 'Kim Grace', salary: 79000, project_count: '1' },
    { name: 'Bonnie Bays', salary: 70000, project_count: '1' },
    { name: 'Tom Brand', salary: 62500, project_count: '1' },
    { name: 'Nandita Ball', salary: 62000, project_count: '1' },
    { name: 'Jenny Vos', salary: 61000, project_count: '1' },
    { name: 'Alec Best', salary: 60000, project_count: '1' },
  ];

  const sql = `SELECT E.fname || ' ' || E.lname AS Name, E.salary, COUNT(W.pno) AS Project_Count 
FROM employee E JOIN works_on W on E.ssn = W.essn 
GROUP BY E.fname, E.lname, E.salary 
ORDER BY E.salary DESC, COUNT(W.pno) DESC `;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await delay(1000);
  // return NextResponse.json(
  //   { error: 'Bir hata meydana geldi.', query: sql },
  //   { status: 400 }
  // );
  return NextResponse.json({ result: data, query: sql });
}
