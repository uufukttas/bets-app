export interface IEventProps {
  id: string;
  sport_key: string;
  sport_title?: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  completed?: boolean;
}

export interface ITeamScoreProps {
name: string;
score: string;
}

export interface IScoreProps {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: ITeamScoreProps[] | null;
  last_update: string | null;
}

export interface IOutcomeProps {
  name: string;
  price: number;
  point?: number;
  description?: string;
}

export interface IMarketProps {
  key: string;
  last_update: string;
  outcomes: IOutcomeProps[];
}

export interface IBookmakerProps {
  key: string;
  title: string;
  last_update: string;
  markets: IMarketProps [];
}

export interface IOddsProps {
  id: string;
  sport_key: string;
  sport_title?: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: IBookmakerProps[];
}

export interface IEventDetailProps {
  event: IEventProps;
  odds?: IOddsProps;
  scores?: IScoreProps;
  similarEvents?: IEventProps[];
}

export interface IBestOddsProps {
  market: string;
  outcome: string;
  bookmaker: string;
  price: number;
  point?: number;
}

export interface IEventSearchFiltersProps {
  sportKey?: string;
  fromDate?: string;
  toDate?: string;
  team?: string;
  status?: 'upcoming' | 'live' | 'completed';
  bookmaker?: string;
}

export interface IEventSearchResultProps {
  events: IEventProps[];
  totalCount: number;
  page: number;
  limit: number;
}