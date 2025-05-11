import { api } from '@/lib/api';
import { IEventProps } from '@/types/event';
import type { IEventSearchResultProps, IEventSearchFiltersProps } from '@/types/eventSearch';

export const searchEvents = async (
  filters: IEventSearchFiltersProps = {},
  page: number = 1,
  limit: number = 20,
  regions: string = 'us',
  bookmaker?: string
): Promise<IEventSearchResultProps> => {
  try {
    const params: string[] = [];

    if (filters.sportKey) {
      let url = `/sports/${filters.sportKey}/events?regions=${regions}`;

      if (bookmaker) {
        url += `&bookmakers=${bookmaker}`;
      }

      const response = await api.get(url);

      let filteredEvents = response.data as IEventProps[];

      if (filters.fromDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.commence_time) >= new Date(filters.fromDate!)
        );
      }

      if (filters.toDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.commence_time) <= new Date(filters.toDate!)
        );
      }

      if (filters.team) {
        const teamLower = filters.team.toLowerCase();

        filteredEvents = filteredEvents.filter(
          event =>
            event.home_team.toLowerCase().includes(teamLower) ||
            event.away_team.toLowerCase().includes(teamLower)
        );
      }

      const totalCount = filteredEvents.length;

      const startIndex = (page - 1) * limit;
      const pagedEvents = filteredEvents.slice(startIndex, startIndex + limit);

      return {
        events: pagedEvents,
        totalCount,
        page,
        limit
      };
    } else {
      let url = `/sports/upcoming/events?regions=${regions}`;

      if (bookmaker) {
        url += `&bookmakers=${bookmaker}`;
      }

      const response = await api.get(url);

      let filteredEvents = response.data as IEventProps[];

      if (filters.fromDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.commence_time) >= new Date(filters.fromDate!)
        );
      }

      if (filters.toDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.commence_time) <= new Date(filters.toDate!)
        );
      }

      if (filters.team) {
        const teamLower = filters.team.toLowerCase();
        filteredEvents = filteredEvents.filter(
          event =>
            event.home_team.toLowerCase().includes(teamLower) ||
            event.away_team.toLowerCase().includes(teamLower)
        );
      }

      const totalCount = filteredEvents.length;

      const startIndex = (page - 1) * limit;
      const pagedEvents = filteredEvents.slice(startIndex, startIndex + limit);

      return {
        events: pagedEvents,
        totalCount,
        page,
        limit
      };
    }
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};
