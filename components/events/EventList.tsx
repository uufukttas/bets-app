import { IEventProps, IEventDetailProps } from '@/types/event';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import EventCard from './EventCard';
import InlineEventDetail from './InlineEventDetail';
import BetSlip from '@/components/betslip/BetSlip';
import { trackEvent, EventTypes } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import { SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import CloseIcon from '@/public/icons/CloseIcon';
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
interface IEventListProps {
  events: IEventProps[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  highlightTeam?: string;
  selectedEventId?: string | null;
  onEventSelect?: (eventId: string, sportKey: string) => void;
  selectedEventData?: IEventDetailProps | null;
  eventDetailLoading?: boolean;
  onDetailClose?: () => void;
}

export default function EventList({
  events,
  loading = false,
  totalCount = 0,
  page = 1,
  limit = 20,
  onPageChange,
  highlightTeam,
  selectedEventId = null,
  onEventSelect,
  selectedEventData = null,
  eventDetailLoading = false,
  onDetailClose,
}: IEventListProps) {
  const eventsPageListClassName: string = `bet-events-page-list`;
  const totalPages: number = totalCount ? Math.ceil(totalCount / limit) : 0;
  const [betSlipOpen, setBetSlipOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  if (loading) {
    return (
      <div
        className={cn(
          `${eventsPageListClassName}-skeleton-container`,
          'grid',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-3',
          'gap-6'
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard
            key={index}
            className={cn(
              `${eventsPageListClassName}-skeleton-card`,
              'border',
              'rounded-lg',
              'overflow-hidden',
              'shadow-sm'
            )}
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className={cn(
          `${eventsPageListClassName}-empty-container`,
          'bg-white',
          'rounded-lg',
          'shadow',
          'p-8',
          'my-6',
          'text-center'
        )}
      >
        <p className={cn(`${eventsPageListClassName}-empty-title`, 'text-gray-600')}>No events found.</p>
        <p className={cn(`${eventsPageListClassName}-empty-description`, 'text-sm', 'text-gray-500', 'mt-2')}>
          Try changing your search filters.
        </p>
      </div>
    );
  }

  const handleEventClick = (eventId: string, sportKey: string) => {
    if (onEventSelect) {
      onEventSelect(eventId, sportKey);

      trackEvent(EventTypes.VIEW_MATCH_DETAIL, {
        eventId: eventId,
        sportKey: sportKey,
        eventName: EventTypes.VIEW_MATCH_DETAIL,
      });
    }
  };

  const toggleBetSlip = () => {
    const newState = !betSlipOpen;
    setBetSlipOpen(newState);
  };

  const handleDetailClose = () => {
    if (onDetailClose) {
      onDetailClose();
    }
  };

  return (
    <div className={cn(`${eventsPageListClassName}-container`, 'relative')}>
      <div
        className={cn(
          `${eventsPageListClassName}-grid`,
          'grid',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:grid-cols-3',
          'gap-6',
          'mb-6'
        )}
      >
        {events.map(event => (
          <div
            key={event.id}
            className={cn(
              `${eventsPageListClassName}-event-card`,
              selectedEventId === event.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
            )}
          >
            <EventCard
              key={event.id}
              event={event}
              highlightTeam={highlightTeam}
              onClick={() => handleEventClick(event.id, event.sport_key)}
              isSelected={selectedEventId === event.id}
            />
          </div>
        ))}
      </div>

      {selectedEventId && (
        <div
          className={cn(
            `${eventsPageListClassName}-event-detail-container`,
            'mb-6',
            'border',
            'rounded-lg',
            'shadow-lg',
            'overflow-hidden'
          )}
        >
          {eventDetailLoading ? (
            <div className={cn(`${eventsPageListClassName}-event-detail-skeleton`, 'bg-white', 'p-8')}>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <SkeletonText lines={1} className="w-1/3" />
                <div className="h-6 w-6"></div>
              </div>
              <div className="space-y-6">
                <SkeletonText lines={2} />
                <div className="flex justify-between space-x-4">
                  <SkeletonText lines={1} className="w-1/3" />
                  <SkeletonText lines={1} className="w-1/3" />
                  <SkeletonText lines={1} className="w-1/3" />
                </div>
                <SkeletonText lines={4} />
              </div>
            </div>
          ) : selectedEventData ? (
            <div className={cn(`${eventsPageListClassName}-event-detail-container`, 'bg-white')}>
              <div
                className={cn(
                  `${eventsPageListClassName}-event-detail-header`,
                  'bg-gray-100',
                  'p-4',
                  'flex',
                  'justify-between',
                  'items-center',
                  'border-b'
                )}
              >
                <h3
                  className={cn(
                    `${eventsPageListClassName}-event-detail-title`,
                    'font-bold',
                    'text-lg',
                    'text-gray-800'
                  )}
                >
                  Event Details
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDetailClose}
                  className={cn(
                    `${eventsPageListClassName}-event-detail-close-button`,
                    'text-gray-500',
                    'hover:text-gray-800',
                    'p-1'
                  )}
                >
                  <CloseIcon />
                </Button>
              </div>
              <InlineEventDetail detail={selectedEventData} />
            </div>
          ) : (
            <div className="bg-white p-6 text-center text-gray-500">
              <p>No details available for this event.</p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={page === 1 ? 'text-gray-400' : 'text-gray-700'}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={page === index + 1 ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(index + 1)}
                className={page === index + 1 ? 'bg-blue-600 text-white' : 'text-gray-700'}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className={page === totalPages ? 'text-gray-400' : 'text-gray-700'}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-4">
        {totalCount > 0 && (
          <p>
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)} of {totalCount} events
          </p>
        )}
      </div>

      {betSlipOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div className="bg-gray-900 w-full max-w-md h-full overflow-auto shadow-lg z-50">
            <BetSlip onClose={() => setBetSlipOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
