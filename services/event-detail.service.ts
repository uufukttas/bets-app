import { api } from '@/lib/api';
import { IEventProps, IScoreProps, IEventDetailProps } from '@/types/event';
import { RegionType, MarketType, OddsFormat } from './odds.service';
import { getLiveScores } from './scores.service';

export const getEventDetail = async (
  sportKey: string,
  eventId: string,
  regions: RegionType | RegionType[] = 'eu',
  markets: MarketType | MarketType[] = ['h2h', 'spreads', 'totals'],
  oddsFormat: OddsFormat = 'decimal'
): Promise<IEventDetailProps> => {
  try {
    const [eventResponse, oddsResponse] = await Promise.all([
      api.get(`/sports/${sportKey}/events?eventIds=${eventId}`),
      api.get(`/sports/${sportKey}/events/${eventId}/odds`, {
        params: {
          regions: Array.isArray(regions) ? regions.join(',') : regions,
          markets: Array.isArray(markets) ? markets.join(',') : markets,
          oddsFormat,
          bookmakers: 'unibet_eu'
        }
      })
    ]);

    const eventData = eventResponse.data[0];
    let scores: IScoreProps | undefined;

    if (eventData && eventData.commence_time) {
      const matchTime = new Date(eventData.commence_time);
      const currentTime = new Date();

      if (matchTime < currentTime) {
        const liveScore = await getLiveScores(sportKey, eventId);

        if (liveScore) {
          scores = liveScore;
        } else {
          scores = {
            id: eventId,
            sport_key: sportKey,
            sport_title: eventData.sport_title || sportKey,
            commence_time: eventData.commence_time,
            completed: false,
            home_team: eventData.home_team,
            away_team: eventData.away_team,
            scores: [
              { name: eventData.home_team, score: "0" },
              { name: eventData.away_team, score: "0" }
            ],
            last_update: new Date().toISOString()
          };
        }
      }
    }

    let similarEvents: IEventProps[] | undefined;

    try {
      const similarEventsResponse = await api.get(`/sports/${sportKey}/events`);

      if (similarEventsResponse.data && similarEventsResponse.data.length > 0) {
        similarEvents = similarEventsResponse.data
          .filter((event: IEventProps) => event.id !== eventId)
          .slice(0, 5);
      }
    } catch (error) {
      console.warn('Similar events data could not be fetched');
    }

    return {
      event: eventData || { id: eventId, sport_key: sportKey },
      odds: oddsResponse.data,
      scores,
      similarEvents
    };
  } catch (error) {
    console.error('Error fetching event detail:', error);

    return {
      event: { id: eventId, sport_key: sportKey, home_team: '', away_team: '', commence_time: '' },
    };
  }
};
