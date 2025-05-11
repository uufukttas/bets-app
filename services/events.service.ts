import { api } from '@/lib/api';

export const getEvents = async (
    sportKey: string,
    regions: string = 'us',
    bookmaker?: string
): Promise<Event[]> => {
    try {
        let url = `/sports/${sportKey}/events?regions=${regions}`;

        if (bookmaker) {
            url += `&bookmakers=${bookmaker}`;
        }

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

