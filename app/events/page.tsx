'use client';

import { useState, useEffect } from 'react';
import { IEventProps, IEventSearchFiltersProps, IEventSearchResultProps, IEventDetailProps } from '@/types/event';
import { searchEvents, getEvents } from '@/services';
import { getEventDetail } from '@/services';
import EventList from '@/components/events/EventList';
import SearchBar from '@/components/events/SearchBar';
import { cn } from '@/lib/utils';

const EventsPage: React.FC = () => {
  const eventsPageClassName: string = `bet-events-page`;
  const [events, setEvents] = useState<IEventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<IEventSearchResultProps | null>(null);
  const [filters, setFilters] = useState<IEventSearchFiltersProps>({});
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [isHistoricalRequest, setIsHistoricalRequest] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<IEventDetailProps | null>(null);
  const [eventDetailLoading, setEventDetailLoading] = useState(false);
  const limit = 12;

  useEffect(() => {
    loadEvents();
  }, [page, filters]);

  const isDateToday = (dateStr: string): boolean => {
    if (!dateStr) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime();
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      try {
        if (filters.sportKey) {
          const sportEvents = await getEvents(filters.sportKey, 'eu', filters.bookmaker || 'unibet_eu');

          result = {
            data: sportEvents,
            meta: {
              total: sportEvents.length,
              count: sportEvents.length,
              pageSize: sportEvents.length,
              page: 1,
            },
          };
        } else {
          result = await searchEvents(filters, page, limit, 'eu', filters.bookmaker || 'unibet_eu');
        }
      } catch (apiError: any) {
        console.error('API Error:', apiError);

        setEvents([]);
        setLoading(false);
        return;
      }

      let filteredEvents = result.data || [];

      if (filters.team && filters.team.trim() !== '') {
        const teamName = filters.team.toLowerCase().trim();

        const exactMatches = filteredEvents.filter(
          (event: IEventProps) =>
            event.home_team.toLowerCase() === teamName || event.away_team.toLowerCase() === teamName
        );

        if (exactMatches.length > 0) {
          filteredEvents = exactMatches;
        } else {
          const partialMatches = filteredEvents.filter(
            (event: IEventProps) =>
              event.home_team.toLowerCase().includes(teamName) || event.away_team.toLowerCase().includes(teamName)
          );
          filteredEvents = partialMatches;
        }

        if (filteredEvents.length === 0) {
          if (result.data && result.data.length > 0) {
            const teams = new Set<string>();

            result.data.forEach((element: IEventProps) => {
              teams.add(element.home_team);
              teams.add(element.away_team);
            });
          }
        }
      }

      setSearchResults({
        events: filteredEvents,
        page,
        limit,
        totalCount: filteredEvents.length || 0,
      });

      setEvents(filteredEvents);
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: IEventSearchFiltersProps) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchEventDetail = async (sportKey: string, eventId: string) => {
    try {
      setEventDetailLoading(true);

      const eventDetail = await getEventDetail(sportKey, eventId);

      setSelectedEventData(eventDetail);
    } catch (detailError) {
      console.error('Error fetching event detail:', detailError);
    } finally {
      setEventDetailLoading(false);
    }
  };

  const handleEventSelect = (eventId: string, sportKey: string) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
      setSelectedEventData(null);
    } else {
      setSelectedEventId(eventId);
      fetchEventDetail(sportKey, eventId);
    }
  };

  const handleDetailClose = () => {
    setSelectedEventId(null);
    setSelectedEventData(null);
  };

  return (
    <div className={cn(`${eventsPageClassName}-container`, 'container', 'mx-auto', 'px-4', 'py-8')}>
      <div className={cn(`${eventsPageClassName}-title-container`, 'mb-8')}>
        <h1 className={cn(`${eventsPageClassName}-title`, 'text-3xl', 'font-bold', 'mb-4')}>Sports Events</h1>
        <p className={cn(`${eventsPageClassName}-description`, 'text-gray-600')}>
          Browse and search upcoming and live sporting events from around the world.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} initialFilters={filters} />

      {error && (
        <div
          className={cn(
            `${eventsPageClassName}-error-container`,
            'mb-4',
            'p-3',
            'bg-red-50',
            'border',
            'border-red-200',
            'rounded-md',
            'text-red-700'
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={cn(`${eventsPageClassName}-error-title`, 'font-medium')}>{error}</p>
              <p className={cn(`${eventsPageClassName}-error-description`, 'text-sm', 'mt-1')}>
                {error.includes('Rate limit')
                  ? 'The API limit has been reached. Please wait a few minutes and try again.'
                  : 'Please check your API configuration or try again later.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <EventList
        events={events}
        loading={loading}
        totalCount={searchResults?.totalCount || 0}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        highlightTeam={filters.team}
        selectedEventId={selectedEventId}
        onEventSelect={handleEventSelect}
        selectedEventData={selectedEventData}
        eventDetailLoading={eventDetailLoading}
        onDetailClose={handleDetailClose}
      />
    </div>
  );
};

export default EventsPage;
