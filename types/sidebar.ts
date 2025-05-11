export interface ISportProps {
    group: string;
    has_outrights: boolean;
    key: string;
    title: string;
}

export interface ISportGroupProps {
    groupName: string;
    groupSports: ISportProps[];
    sportCount: number;
}

export interface ISportItemProps {
    isSelected: boolean;
    sport: ISportProps;
    onSelect: (sportId: string) => void;
}

export interface ISportGroupComponentProps {
    group: ISportGroupProps;
    selectedSportId: string | null;
    onSportSelect: (sportId: string) => void;
} 