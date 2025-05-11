import { IEventProps } from "./event";
export interface IEventSearchFiltersProps {
    sportKey?: string;
    fromDate?: string;
    toDate?: string;
    team?: string;
    status?: 'upcoming' | 'live' | 'completed';
}

export interface IEventSearchResultProps {
    events: IEventProps[];
    totalCount: number;
    page: number;
    limit: number;
}