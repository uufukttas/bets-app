export interface IEventsListProps {
    loading: boolean;
    eventsLoading: boolean;
    selectedSportId: string | null;
    events: any[];
    oddsData: any[];
    selectedEventId: string | null;
    handleEventSelect: (eventId: string) => void;
}