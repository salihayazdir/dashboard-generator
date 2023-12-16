import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type SqlResult = {
  sql: string;
};

const fetchPromptToData = async (params: {
  prompt: string;
  dataSourceId: number;
}): Promise<SqlResult> => {
  const { data } = await axios.post(`/api/prompt-to-data`, {
    prompt: params.prompt,
    dataSourceId: params.dataSourceId,
  });
  return data.sql;
};

export const usePromptToData = (params: {
  prompt: string;
  dataSourceId: number;
}) => {
  return useQuery<SqlResult, Error>({
    queryKey: ['prompt-to-data', params],
    queryFn: () => fetchPromptToData(params),
  });
};
