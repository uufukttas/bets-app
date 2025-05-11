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