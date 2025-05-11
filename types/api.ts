
export interface IApiErrorProps {
  message: string;
  code?: string;
  status?: number;
}

export interface IApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    count?: number;
    page?: number;
    pageSize?: number;
  };
  success: boolean;
}

export interface ISportProps {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface IBookmakerProps {
  key: string;
  title: string;
  last_update: string;
  markets: IMarketProps[];
}

export interface IMarketProps {
  key: string;
  last_update: string;
  outcomes: IOutcomeProps[];
}

export interface IOutcomeProps {
  name: string;
  price: number;
  point?: number;
  description?: string;
}

export interface IEventProps {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: IBookmakerProps[];
  scores?: IScoreProps[];
  completed?: boolean;
}

export interface IScoreProps {
  name: string;
  score: string | number;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface ISearchParams {
  sportKey?: string;
  fromDate?: string;
  toDate?: string;
  team?: string;
  bookmaker?: string;
  market?: string;
}

export interface IUserProps {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface IAuthCredentialsProps {
  email: string;
  password: string;
} 