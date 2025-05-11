import { apiGet } from './api';
import { ISportProps, IEventProps, ISearchParams, IApiResponse } from '../types/api';

export async function getSports(all: boolean = false): Promise<ISportProps[]> {
  try {
    const endpoint = all ? '/sports?all=true' : '/sports';
    return await apiGet<ISportProps[]>(endpoint);
  } catch (error) {
    console.error('Failed to fetch sports:', error);
    throw error;
  }
}


export async function getSportsWithOutrights(): Promise<ISportProps[]> {
  try {
    const sports = await getSports(true);
    return sports.filter(sport => sport.has_outrights);
  } catch (error) {
    console.error('Failed to fetch sports with outrights:', error);
    throw error;
  }
}

export async function getEvents(
  sportKey: string,
  regions: string = 'eu',
  bookmakers: string = 'unibet_eu'
): Promise<IEventProps[]> {
  try {
    const config = {
      params: {
        regions,
        bookmakers
      }
    };

    return await apiGet<IEventProps[]>(`/sports/${sportKey}/odds`, config);
  } catch (error) {
    console.error(`Failed to fetch events for sport ${sportKey}:`, error);
    throw error;
  }
}

export async function getUpcomingEvents(
  limit: number = 10,
  regions: string = 'eu',
  bookmakers: string = 'unibet_eu'
): Promise<IEventProps[]> {
  try {
    const sports = await getSports();
    const activeKeys = sports.filter(sport => sport.active).map(sport => sport.key);

    const allEvents: IEventProps[] = [];

    await Promise.all(
      activeKeys.map(async (key) => {
        try {
          const events = await getEvents(key, regions, bookmakers);
          allEvents.push(...events);
        } catch (error) {
          console.warn(`Failed to fetch events for sport ${key}:`, error);
        }
      })
    );

    return allEvents
      .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error);
    throw error;
  }
}


export async function searchEvents(
  params: ISearchParams,
  page: number = 1,
  limit: number = 20,
  regions: string = 'eu',
  bookmakers: string = 'unibet_eu'
): Promise<IApiResponse<IEventProps[]>> {
  try {
    const { sportKey, fromDate, toDate, team, bookmaker, market } = params;

    let events: IEventProps[] = [];

    if (sportKey) {
      events = await getEvents(sportKey, regions, bookmakers);
    } else {
      const sports = await getSports();

    }

    let filteredEvents = events;

    if (fromDate) {
      filteredEvents = filteredEvents.filter(event =>
        new Date(event.commence_time) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filteredEvents = filteredEvents.filter(event =>
        new Date(event.commence_time) <= new Date(toDate)
      );
    }

    if (team) {
      const teamLower = team.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.home_team.toLowerCase().includes(teamLower) ||
        event.away_team.toLowerCase().includes(teamLower)
      );
    }

    if (bookmaker) {
      filteredEvents = filteredEvents.filter(event =>
        event.bookmakers.some(bm => bm.key === bookmaker)
      );
    }

    if (market) {
      filteredEvents = filteredEvents.filter(event =>
        event.bookmakers.some(bm =>
          bm.markets.some(m => m.key === market)
        )
      );
    }

    const total = filteredEvents.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    return {
      data: paginatedEvents,
      meta: {
        total,
        count: paginatedEvents.length,
        page,
        pageSize: limit
      },
      success: true
    };
  } catch (error) {
    console.error('Failed to search events:', error);
    throw error;
  }
}

export async function getFeaturedEvents(
  limit: number = 5,
  regions: string = 'eu',
  bookmakers: string = 'unibet_eu'
): Promise<IEventProps[]> {
  try {

    const popularSportKeys = ['soccer_epl', 'basketball_nba', 'americanfootball_nfl'];
    const allEvents: IEventProps[] = [];

    await Promise.all(
      popularSportKeys.map(async (key) => {
        try {
          const events = await getEvents(key, regions, bookmakers);
          allEvents.push(...events);
        } catch (error) {
          console.warn(`Failed to fetch events for sport ${key}:`, error);
        }
      })
    );

    return allEvents
      .sort((a, b) => b.bookmakers.length - a.bookmakers.length)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch featured events:', error);
    throw error;
  }
} 