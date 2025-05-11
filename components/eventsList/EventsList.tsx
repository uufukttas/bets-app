import React from 'react';
import type { IEventsListProps } from '@/types/eventsList';
import { cn } from '@/lib/utils';
import Spinner from '../ui/Spinner';

const EventsList = ({
  loading,
  eventsLoading,
  selectedSportId,
  events,
  oddsData,
  selectedEventId,
  handleEventSelect,
}: IEventsListProps) => {
  const eventsListClassName = 'bet-events-list';

  const formatTime = (time: string) => {
    const date = new Date(time);
    return `${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString(
      'en-US',
      { month: '2-digit', day: '2-digit', year: 'numeric' }
    )}`;
  };

  const isEventLive = (commenceTime: string) => {
    const eventTime = new Date(commenceTime);
    const currentTime = new Date();
    return eventTime < currentTime;
  };

  return (
    <div className={cn(`${eventsListClassName} p-6`)}>
      {loading || eventsLoading ? (
        <Spinner />
      ) : (
        <>
          {selectedSportId && (
            <div className={cn(`${eventsListClassName}-header mb-4`)}>
              <h2 className={cn(`${eventsListClassName}-header-title text-xl font-bold text-white mb-1`)}>
                {events[0]?.sport_title || selectedSportId}
              </h2>
              <p className={cn(`${eventsListClassName}-header-description text-gray-400 text-sm`)}>
                Showing {oddsData.length} available events
              </p>
            </div>
          )}

          <div className={cn(`${eventsListClassName}-list space-y-1`)}>
            {oddsData.map(event => (
              <div
                className={cn(
                  `${eventsListClassName}-list-item cursor-pointer ${
                    selectedEventId === event.id ? 'border-l-4 border-blue-500' : ''
                  }`
                )}
                key={event.id}
                onClick={() => handleEventSelect(event.id)}
              >
                <div
                  className={cn(
                    `${eventsListClassName}-list-item-container`,
                    'bg-gray-900 text-white rounded-sm overflow-hidden mb-1 border border-gray-800 p-3'
                  )}
                >
                  <div
                    className={cn(
                      `${eventsListClassName}-list-item-container-content flex justify-between items-center`
                    )}
                  >
                    <div
                      className={cn(
                        `${eventsListClassName}-list-item-container-content-title`,
                        'font-medium flex justify-between items-center w-full'
                      )}
                    >
                      <div
                        className={cn(
                          `${eventsListClassName}-list-item-container-content-title-home-team w-1/3 text-left`
                        )}
                      >
                        {event.home_team}
                      </div>
                      <div
                        className={cn(
                          `${eventsListClassName}-list-item-container-content-title-live-status-container`,
                          `text-sm text-gray-400 w-1/3 text-center`
                        )}
                      >
                        {isEventLive(event.commence_time) ? (
                          <span
                            className={cn(
                              `${eventsListClassName}-list-item-container-content-title-live-status`,
                              `bg-red-600 text-white px-2 py-1 rounded-sm`
                            )}
                          >
                            LIVE
                          </span>
                        ) : (
                          formatTime(event.commence_time)
                        )}
                      </div>
                      <div
                        className={cn(
                          `${eventsListClassName}-list-item-container-content-title-away-team w-1/3 text-right`
                        )}
                      >
                        {event.away_team}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsList;
