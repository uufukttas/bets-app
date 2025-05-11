import { api } from '@/lib/api';
import { ISportProps } from '@/types/sport';

export const getSports = async (all?: boolean): Promise<ISportProps[]> => {
  try {
    const url = all ? '/sports?all=true' : '/sports';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw error;
  }
};

export const getSportsWithOutrights = async (): Promise<ISportProps[]> => {
  try {
    const response = await api.get('/sports?outrights=true');
    return response.data;
  } catch (error) {
    console.error('Error fetching sports with outrights:', error);
    throw error;
  }
};
