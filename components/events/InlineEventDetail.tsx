import { useState, useEffect } from 'react';
import { IEventDetailProps } from '@/types/event';
import { formatDistanceToNow, format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addToBet, removeFromBet } from '@/store/slices/cartSlice';
import { trackEvent, EventTypes } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

interface IInlineEventDetailProps {
  detail: IEventDetailProps;
}

export default function InlineEventDetail({ detail }: IInlineEventDetailProps) {
  const inlineEventDetailClassName = 'inline-event-detail';
  const { event, odds, scores } = detail;
  const [selectedMarket, setSelectedMarket] = useState<string>('h2h');

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const currentEventSelection = cartItems.find(item => item.event.id === odds?.id);

  const eventDate = new Date(event.commence_time);
  const isUpcoming = eventDate > new Date();
  const formattedDate = format(eventDate, 'PPP p');
  const relativeDate = formatDistanceToNow(eventDate, { addSuffix: true });

  useEffect(() => {
    if (event && event.id) {
      trackEvent(EventTypes.VIEW_MATCH_DETAIL, {
        event_id: event.id,
        event_name: EventTypes.VIEW_MATCH_DETAIL,
        sport_key: event.sport_key,
        view_type: 'inline_detail',
      });
    }
  }, [event]);

  const bookmakers = odds?.bookmakers || [];

  const availableMarkets = new Set<string>();
  odds?.bookmakers.forEach(bookmaker => {
    bookmaker.markets.forEach(market => {
      availableMarkets.add(market.key);
    });
  });

  const marketDisplayNames: Record<string, string> = {
    h2h: 'Moneyline',
    spreads: 'Point Spread',
    totals: 'Over/Under',
    outrights: 'Outright Winner',
  };

  const formatScores = () => {
    if (!scores || !scores.scores) return 'No scores available';

    const homeScore = scores.scores.find(s => s.name === event.home_team)?.score || '0';
    const awayScore = scores.scores.find(s => s.name === event.away_team)?.score || '0';

    return `${homeScore} - ${awayScore}`;
  };

  const isBetSelected = (marketKey: string, selectionName: string) => {
    return currentEventSelection?.market === marketKey && currentEventSelection?.outcome.name === selectionName;
  };

  const handleBetSelect = (marketKey: string, marketName: string, selectionName: string, selectionOdds: number) => {
    if (isBetSelected(marketKey, selectionName)) {
      if (currentEventSelection) {
        dispatch(removeFromBet(currentEventSelection.id));
      }

      const success = trackEvent(EventTypes.REMOVE_FROM_CART, {
        event_id: odds?.id || '',
        event_name: EventTypes.REMOVE_FROM_CART,
        sport_key: event.sport_key,
      });
    } else {
      dispatch(
        addToBet({
          event: {
            id: odds?.id || '',
            sport_key: event.sport_key,
            sport_title: event.sport_title,
            commence_time: event.commence_time,
            home_team: event.home_team,
            away_team: event.away_team,
          },
          market: marketKey,
          outcome: {
            name: selectionName,
            price: selectionOdds,
          },
          bookmaker: bookmakers[0]?.title || '',
        })
      );

      const success = trackEvent(EventTypes.ADD_TO_CART, {
        event_id: odds?.id || '',
        event_name: EventTypes.ADD_TO_CART,
        sport_key: event.sport_key,
      });
    }
  };

  const handleMarketChange = (market: string) => {
    setSelectedMarket(market);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">{event.sport_title || event.sport_key}</div>

          {event.completed && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Completed</span>
          )}

          {isUpcoming && !event.completed && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Upcoming</span>
          )}

          {!isUpcoming && !event.completed && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">Live</span>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {formattedDate} ({relativeDate})
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-lg text-black">
        <div className="text-lg font-bold">{event.home_team}</div>

        {scores && scores.scores && <div className="text-2xl font-bold">{formatScores()}</div>}

        <div className="text-lg font-bold">{event.away_team}</div>
      </div>

      {availableMarkets.size > 0 && (
        <div className={cn(`${inlineEventDetailClassName}-market-type-container`, 'mb-4')}>
          <div
            className={cn(
              `${inlineEventDetailClassName}-market-type-title`,
              'text-sm',
              'font-medium',
              'text-gray-700',
              'mb-2'
            )}
          >
            Market Type
          </div>
          <div className={cn(`${inlineEventDetailClassName}-market-type-buttons`, 'flex', 'flex-wrap', 'gap-2')}>
            {Array.from(availableMarkets).map(market => (
              <Button
                key={market}
                onClick={() => handleMarketChange(market)}
                className={cn(
                  'py-1 px-3 text-sm rounded-full text-black',
                  selectedMarket === market
                    ? '!bg-blue-600 !text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  '!text-black'
                )}
              >
                {marketDisplayNames[market] || market}
              </Button>
            ))}
          </div>
        </div>
      )}

      {currentEventSelection && (
        <div
          className={cn(
            `${inlineEventDetailClassName}-bet-selection-container`,
            'bg-blue-50',
            'border',
            'border-blue-200',
            'text-blue-800',
            'px-4',
            'py-3',
            'rounded-md',
            'mb-4'
          )}
        >
          <p className={cn(`${inlineEventDetailClassName}-bet-selection-text`, 'text-sm')}>
            You have a bet on <strong>{currentEventSelection.outcome.name}</strong> ({currentEventSelection.market})
            {currentEventSelection.outcome.price.toFixed(2)}
          </p>
        </div>
      )}

      {bookmakers.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-3">Betting Odds</h3>

          <div className="border rounded-lg overflow-hidden">
            {selectedMarket === 'h2h' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bookmaker</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {event.home_team}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Draw</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {event.away_team}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookmakers.map(bookmaker => {
                    const market = bookmaker.markets.find(m => m.key === 'h2h');

                    if (!market) return null;

                    return (
                      <tr key={bookmaker.key}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bookmaker.title}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'h2h',
                                'Match Winner',
                                event.home_team,
                                market.outcomes.find(o => o.name === event.home_team)?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('h2h', event.home_team)
                                ? '!bg-green-500 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            {market.outcomes.find(o => o.name === event.home_team)?.price.toFixed(2) || '-'}
                          </Button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'h2h',
                                'Match Winner',
                                'Draw',
                                market.outcomes.find(o => o.name === 'Draw')?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('h2h', 'Draw')
                                ? '!bg-green-500 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            {market.outcomes.find(o => o.name === 'Draw')?.price.toFixed(2) || '-'}
                          </Button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'h2h',
                                'Match Winner',
                                event.away_team,
                                market.outcomes.find(o => o.name === event.away_team)?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('h2h', event.away_team)
                                ? '!bg-green-500 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            {market.outcomes.find(o => o.name === event.away_team)?.price.toFixed(2) || '-'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {selectedMarket === 'spreads' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bookmaker</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {event.home_team}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {event.away_team}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookmakers.map(bookmaker => {
                    const market = bookmaker.markets.find(m => m.key === 'spreads');

                    if (!market) return null;

                    const homeOutcome = market.outcomes.find(o => o.name === event.home_team);
                    const awayOutcome = market.outcomes.find(o => o.name === event.away_team);

                    return (
                      <tr key={bookmaker.key}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bookmaker.title}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'spreads',
                                'Point Spread',
                                `${event.home_team} ${homeOutcome?.point}`,
                                homeOutcome?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('spreads', `${event.home_team} ${homeOutcome?.point}`)
                                ? '!bg-green-500 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            {homeOutcome?.point} @ {homeOutcome?.price.toFixed(2)}
                          </Button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'spreads',
                                'Point Spread',
                                `${event.away_team} ${awayOutcome?.point}`,
                                awayOutcome?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('spreads', `${event.away_team} ${awayOutcome?.point}`)
                                ? '!bg-green-500 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            {awayOutcome?.point} @ {awayOutcome?.price.toFixed(2)}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {selectedMarket === 'totals' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bookmaker</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Over</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Under</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookmakers.map(bookmaker => {
                    const market = bookmaker.markets.find(m => m.key === 'totals');

                    if (!market) return null;

                    const overOutcome = market.outcomes.find(o => o.name === 'Over');
                    const underOutcome = market.outcomes.find(o => o.name === 'Under');

                    return (
                      <tr key={bookmaker.key}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bookmaker.title}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'totals',
                                'Total Goals',
                                `Over ${overOutcome?.point}`,
                                overOutcome?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('totals', `Over ${overOutcome?.point}`)
                                ? '!bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            O {overOutcome?.point} @ {overOutcome?.price.toFixed(2)}
                          </Button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            onClick={() =>
                              handleBetSelect(
                                'totals',
                                'Total Goals',
                                `Under ${underOutcome?.point}`,
                                underOutcome?.price || 0
                              )
                            }
                            className={`py-1 px-2 rounded ${
                              isBetSelected('totals', `Under ${underOutcome?.point}`)
                                ? '!bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 !hover:bg-blue-100'
                            }`}
                          >
                            U {underOutcome?.point} @ {underOutcome?.price.toFixed(2)}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">No betting odds available for this event.</div>
      )}
    </div>
  );
}
