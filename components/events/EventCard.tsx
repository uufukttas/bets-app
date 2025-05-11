import Link from 'next/link';
import { IEventProps } from '@/types/event';
import { formatDistanceToNow } from 'date-fns';
import { trackEvent, EventTypes } from '@/lib/firebase';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
interface IEventCardProps {
  event: IEventProps;
  highlightTeam?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function EventCard({ event, highlightTeam, isSelected = false, onClick }: IEventCardProps) {
  const eventCardClassName: string = 'bet-event-card';
  const eventDate = new Date(event.commence_time);
  const formattedDate = formatDistanceToNow(eventDate, { addSuffix: true });

  const shouldHighlightHome = highlightTeam && event.home_team.toLowerCase().includes(highlightTeam.toLowerCase());
  const shouldHighlightAway = highlightTeam && event.away_team.toLowerCase().includes(highlightTeam.toLowerCase());

  const handleViewDetailsClick = () => {
    trackEvent(EventTypes.VIEW_MATCH_DETAIL, {
      eventId: event.id,
      sportKey: event.sport_key,
      eventName: EventTypes.VIEW_MATCH_DETAIL,
    });

    if (onClick) onClick();
  };

  return (
    <Card className={cn(eventCardClassName, isSelected ? 'bg-blue-50' : '')} hoverEffect={true}>
      <CardHeader className="bg-gray-50 px-4 py-2">
        <span className="text-xs font-medium text-gray-500">{event.sport_title || event.sport_key}</span>
      </CardHeader>

      <CardBody className="p-4 text-black">
        <div className="flex justify-between items-center mb-3 text-black">
          <h3
            className={cn(
              eventCardClassName,
              'font-semibold',
              shouldHighlightHome ? 'text-blue-600 bg-blue-50 px-1 rounded' : ''
            )}
          >
            {event.home_team}
          </h3>
          <span className="text-sm text-gray-500">vs</span>
          <h3
            className={cn(
              eventCardClassName,
              'font-semibold text-right',
              shouldHighlightAway ? 'text-blue-600 bg-blue-50 px-1 rounded' : ''
            )}
          >
            {event.away_team}
          </h3>
        </div>

        <div className="text-gray-600 text-sm mb-4">{formattedDate}</div>

        <div className="flex space-x-2">
          <Button
            variant={isSelected ? 'primary' : 'primary'}
            onClick={handleViewDetailsClick}
            fullWidth
            className={isSelected ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'}
          >
            {isSelected ? 'Hide Details' : 'View Details'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
