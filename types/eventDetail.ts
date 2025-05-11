import { IOddsProps, IScoreProps, IOutcomeProps } from '@/types/event';

export interface IBetEventDetailProps {
    odds: IOddsProps;
    onClose: () => void;
    scores?: IScoreProps;
}

interface IOutcomeWithOddsProps {
    outcome: IOutcomeProps | null;
    odds: number;
}

export interface IBetEventDetailHeaderProps {
    isLive: boolean;
    onClose: () => void;
}

export interface IScoreSectionProps {
    odds: IOddsProps;
    isLive: boolean;
    formattedScore: string;
}

export interface IBetEventCardProps {
    odds: IOddsProps;
    isLive?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}