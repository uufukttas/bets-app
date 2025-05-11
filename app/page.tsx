'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchSports } from '@/store/slices/sportsSlice';
import { fetchEvents } from '@/store/slices/eventsSlice';
import Sidebar from '@/components/layouts/Sidebar/Sidebar';
import { getOdds } from '@/services/odds.service';
import { EventTypes, trackEvent } from '@/lib/firebase';
import { IOddsProps, IScoreProps } from '@/types/event';
import BetEventDetail from '@/components/events/BetEventDetail';
import CartButton from '@/components/shopcart/ShopButton';
import { getEventDetail } from '@/services/event-detail.service';
import EventsList from '@/components/eventsList/EventsList';
import BetEmptyEventDetail from '@/components/events/BetEmptyEventDetail';
import { SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading: eventsLoading, selectedSportId } = useSelector((state: RootState) => state.events);
  const [oddsData, setOddsData] = useState<IOddsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<IOddsProps | null>(null);
  const [selectedEventScores, setSelectedEventScores] = useState<IScoreProps | null>(null);
  const [loadingEventDetail, setLoadingEventDetail] = useState(false);

  useEffect(() => {
    dispatch(fetchSports());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSportId) {
      setLoading(true);
      dispatch(fetchEvents(selectedSportId));

      getOdds(selectedSportId)
        .then(odds => {
          setOddsData(odds);
          setSelectedEventId(null);
          setSelectedEventData(null);
          setSelectedEventScores(null);
        })
        .catch(err => console.error('Error fetching odds:', err))
        .finally(() => setLoading(false));
    }
  }, [selectedSportId, dispatch]);

  const fetchEventDetail = async (sportId: string, eventId: string) => {
    if (!sportId || !eventId) return;

    trackEvent(EventTypes.VIEW_MATCH_DETAIL, {
      eventId: eventId,
      sportKey: sportId,
      eventName: EventTypes.VIEW_MATCH_DETAIL,
    });

    setLoadingEventDetail(true);
    try {
      const eventDetail = await getEventDetail(sportId, eventId);

      if (eventDetail.odds) {
        setSelectedEventData(eventDetail.odds);
      } else {
        const basicOdds = oddsData.find(event => event.id === eventId);

        setSelectedEventData(basicOdds || null);
      }

      if (eventDetail.scores) {
        setSelectedEventScores(eventDetail.scores);
      } else {
        setSelectedEventScores(null);
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
      const basicOdds = oddsData.find(event => event.id === eventId);

      setSelectedEventData(basicOdds || null);
      setSelectedEventScores(null);
    } finally {
      setLoadingEventDetail(false);
    }
  };

  const handleEventSelect = (eventId: string) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
      setSelectedEventData(null);
      setSelectedEventScores(null);
    } else {
      setSelectedEventId(eventId);

      if (selectedSportId) {
        fetchEventDetail(selectedSportId, eventId);
      }
    }

    trackEvent(EventTypes.VIEW_MATCH_DETAIL, {
      eventName: EventTypes.VIEW_MATCH_DETAIL,
      eventId: eventId,
      sportKey: selectedSportId,
    });
  };

  const handleDetailClose = () => {
    setSelectedEventId(null);
    setSelectedEventData(null);
    setSelectedEventScores(null);
  };

  return (
    <div className="bet-app-main-page-container w-full h-full flex text-text bg-background">
      <Sidebar />

      <div className="bet-app-cart-button-wrapper fixed top-4 right-4 z-20">
        <CartButton />
      </div>

      <div
        className={`bet-app-main-page-container-event-list-section bg-gray-900 h-full overflow-y-auto 
          ${selectedEventId ? 'w-1/2 md:w-2/5' : 'w-full'}`}
      >
        <EventsList
          loading={loading}
          eventsLoading={eventsLoading}
          selectedSportId={selectedSportId}
          events={events}
          oddsData={oddsData}
          selectedEventId={selectedEventId}
          handleEventSelect={handleEventSelect}
        />
      </div>

      {selectedEventId && (
        <div
          className="bet-app-main-page-container-event-detail-section w-1/2 md:w-3/5 bg-gray-900 
            border-l border-gray-800 h-full overflow-y-auto"
        >
          {loadingEventDetail ? (
            <div className="p-6 bg-white">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <SkeletonText lines={1} className="w-1/3" />
                <div className="h-6 w-6"></div>
              </div>
              <div className="space-y-8">
                <div className="flex justify-between">
                  <SkeletonText lines={1} className="w-1/4" />
                  <SkeletonText lines={1} className="w-1/4" />
                </div>
                <SkeletonText lines={2} />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              </div>
            </div>
          ) : selectedEventData ? (
            <BetEventDetail
              odds={selectedEventData}
              scores={selectedEventScores || undefined}
              onClose={handleDetailClose}
            />
          ) : (
            <BetEmptyEventDetail />
          )}
        </div>
      )}
    </div>
  );
}
