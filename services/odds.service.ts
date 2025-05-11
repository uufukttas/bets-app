import { api } from '@/lib/api';
import { IOddsProps } from '@/types/event';

export type MarketType = 'h2h' | 'spreads' | 'totals' | 'outrights' | string;
export type RegionType = 'us' | 'us2' | 'uk' | 'au' | 'eu';
export type OddsFormat = 'decimal' | 'american' | 'fractional';

export const getOdds = async (
  sportKey: string,
  regions: RegionType | RegionType[] = 'eu',
  markets: MarketType | MarketType[] = ['h2h', 'spreads', 'totals'],
  oddsFormat: OddsFormat = 'decimal'
): Promise<IOddsProps[]> => {
  try {
    const regionsParam = Array.isArray(regions) ? regions.join(',') : regions;
    const marketsParam = Array.isArray(markets) ? markets.join(',') : markets;

    const response = await api.get(
      `/sports/${sportKey}/odds`, {
      params: {
        regions: regionsParam,
        markets: marketsParam,
        oddsFormat,
        bookmakers: 'unibet_eu'
      }
    }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    return [];
  }
};

