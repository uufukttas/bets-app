import { api } from '@/lib/api';
import { IScoreProps } from '@/types/score';

export const getScores = async (sportKey: string, daysFrom?: number): Promise<IScoreProps[]> => {
  try {
    let url = `/sports/${sportKey}/scores`;

    if (daysFrom !== undefined && daysFrom >= 1 && daysFrom <= 3) {
      url += `?daysFrom=${daysFrom}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};


export const getEventScores = async (
  sportKey: string,
  eventIds: string[],
  daysFrom?: number
): Promise<IScoreProps[]> => {
  try {
    let url = `/sports/${sportKey}/scores?eventIds=${eventIds.join(',')}`;

    if (daysFrom !== undefined && daysFrom >= 1 && daysFrom <= 3) {
      url += `&daysFrom=${daysFrom}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching event scores:', error);
    throw error;
  }
};

export const getLiveScores = async (
  sportKey: string,
  eventId: string
): Promise<IScoreProps | null> => {
  try {
    const response = await api.get(`/sports/${sportKey}/scores`, {
      params: {
        eventIds: eventId
      }
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching live scores:', error);

    return null;
  }
};
