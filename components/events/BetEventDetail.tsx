import React, { useEffect, useState } from 'react';
import { IOddsProps, IMarketProps, IOutcomeProps, IScoreProps, ITeamScoreProps } from '@/types/event';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToBet, removeFromBet } from '@/store/slices/cartSlice';
import { EventTypes } from '@/lib/firebase';
import { trackEvent } from '@/lib/firebase';
import { IBetEventDetailProps } from '@/types/eventDetail';
import BetEventDetailHeader from './BetEventDetailHeader';
import ScoreSection from './ScoreSection';
import { cn } from '@/lib/utils';

const BetEventDetail: React.FC<IBetEventDetailProps> = ({ odds, onClose, scores }: IBetEventDetailProps) => {
  const betEventDetailClassName: string = 'bet-detail-section-content';
  const formatOdds = (price: number): string => price.toFixed(2);

  const [bookmakerMarkets, setBookmakerMarkets] = useState<IMarketProps[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [formattedScore, setFormattedScore] = useState<string>('0-0');

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const currentEventSelection = cartItems.find(item => item.event.id === odds.id);

  useEffect(() => {
    if (odds?.bookmakers && odds.bookmakers.length > 0) {
      setBookmakerMarkets(odds.bookmakers[0].markets || []);
    }

    if (odds?.commence_time) {
      const matchTime = new Date(odds.commence_time);
      const currentTime = new Date();
      const isMatchLive = matchTime < currentTime;

      setIsLive(isMatchLive);

      if (isMatchLive && scores) {
        if (scores.scores && scores.scores.length > 0) {
          const homeScore = scores.scores.find((s: ITeamScoreProps) => s.name === odds.home_team)?.score || '0';
          const awayScore = scores.scores.find((s: ITeamScoreProps) => s.name === odds.away_team)?.score || '0';
          setFormattedScore(`${homeScore}-${awayScore}`);
        }
      }
    }
  }, [odds, scores]);

  const formatTime = (time: string): string => {
    const date = new Date(time);

    return `${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString(
      'en-US',
      { month: '2-digit', day: '2-digit', year: 'numeric' }
    )}`;
  };

  const matchOddsMarket: IMarketProps | undefined = bookmakerMarkets.find(m => m.key === 'h2h');

  const totalGoalsMarket: IMarketProps | undefined = bookmakerMarkets.find(m => m.key === 'totals');

  const findOutcome = (market: IMarketProps | undefined, name: string): IOutcomeProps | null => {
    if (!market) return null;

    return market.outcomes.find(o => o.name === name) || null;
  };

  const hasValidData: boolean = Boolean(
    odds && odds.bookmakers && odds.bookmakers.length > 0 && bookmakerMarkets.length > 0
  );

  const isBetSelected = (marketKey: string, selectionName: string): boolean => {
    return Boolean(
      currentEventSelection?.market === marketKey && currentEventSelection?.outcome.name === selectionName
    );
  };

  const handleBetSelect = (
    marketKey: string,
    marketName: string,
    selectionName: string,
    selectionOdds: number
  ): void => {
    if (isBetSelected(marketKey, selectionName)) {
      if (currentEventSelection) {
        dispatch(removeFromBet(currentEventSelection.id));
      }

      trackEvent(EventTypes.REMOVE_FROM_CART, {
        event_id: odds.id,
        event_name: EventTypes.REMOVE_FROM_CART,
        sport_key: odds.sport_key,
      });
    } else {
      dispatch(
        addToBet({
          event: {
            id: odds.id,
            sport_key: odds.sport_key,
            sport_title: odds.sport_title,
            commence_time: odds.commence_time,
            home_team: odds.home_team,
            away_team: odds.away_team,
          },
          market: marketKey,
          outcome: {
            name: selectionName,
            price: selectionOdds,
          },
          bookmaker: odds.bookmakers[0]?.key || '',
        })
      );

      trackEvent(EventTypes.ADD_TO_CART, {
        event_id: odds.id,
        event_name: EventTypes.ADD_TO_CART,
        sport_key: odds.sport_key,
      });
    }
  };

  return (
    <div className={betEventDetailClassName}>
      <BetEventDetailHeader isLive={isLive} onClose={onClose} />

      {!hasValidData ? (
        <div className={`${betEventDetailClassName}-no-data p-4 text-center text-gray-400`}>
          <p>No detailed betting data available for this event.</p>
        </div>
      ) : (
        <div className={`${betEventDetailClassName} p-4`}>
          <div className={`${betEventDetailClassName}-live-section mb-6 p-4 ${isLive ? 'bg-gray-800 rounded-lg' : ''}`}>
            {isLive && (
              <div
                className={`${cn(
                  betEventDetailClassName,
                  'live-badge'
                )} bg-red-600 text-white px-2 py-1 rounded-sm inline-block mb-2`}
              >
                LIVE
              </div>
            )}

            <ScoreSection odds={odds} isLive={isLive} formattedScore={formattedScore} />

            <div className={`${betEventDetailClassName}-time-section mt-2 text-sm text-gray-400`}>
              {isLive ? `Started: ${formatTime(odds.commence_time)}` : `Starts: ${formatTime(odds.commence_time)}`}
            </div>

            {currentEventSelection && (
              <div
                className={`${cn(
                  betEventDetailClassName,
                  'selected-bet-section'
                )} mt-3 p-2 bg-green-800 bg-opacity-40 rounded-md`}
              >
                <div className={`${betEventDetailClassName}-selected-bet-section-title text-sm text-green-400`}>
                  Selected Bet:
                </div>
                <div className={`${betEventDetailClassName}-selected-bet-section-bet-info font-medium`}>
                  {currentEventSelection.market}: {currentEventSelection.outcome.name} @{' '}
                  {currentEventSelection.outcome.price.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {matchOddsMarket && (
            <div
              className={`${cn(
                betEventDetailClassName,
                'match-odds-section'
              )} border border-gray-800 rounded-md mb-6 overflow-hidden`}
            >
              <div className={`${betEventDetailClassName}-match-odds-section-title p-3 bg-gray-800`}>
                <div className={`${betEventDetailClassName}-match-odds-section-title-text font-medium text-lg`}>
                  1X2 Match Odds
                </div>
              </div>

              <div className={`${betEventDetailClassName}-match-odds-section-odds-row p-3 border-b border-gray-800`}>
                <div
                  className={`${cn(
                    betEventDetailClassName,
                    'match-odds-section-odds-row-home-win'
                  )} flex justify-between items-center`}
                >
                  <div>
                    <span className="text-sm font-medium">1</span>
                    <span className="text-xs text-gray-400 ml-2">Home Win</span>
                  </div>
                  {findOutcome(matchOddsMarket, odds.home_team) && (
                    <button
                      onClick={() =>
                        handleBetSelect(
                          matchOddsMarket.key,
                          '1X2',
                          odds.home_team,
                          findOutcome(matchOddsMarket, odds.home_team)?.price || 0
                        )
                      }
                      className={`rounded-full py-1 px-4 text-center font-medium transition-colors ${
                        isBetSelected(matchOddsMarket.key, odds.home_team)
                          ? 'bg-green-500 text-black'
                          : 'bg-yellow-200 text-black hover:bg-yellow-300'
                      }`}
                    >
                      {findOutcome(matchOddsMarket, odds.home_team)?.price.toFixed(2) || '-'}
                    </button>
                  )}
                </div>
              </div>

              <div className={`${betEventDetailClassName}-match-odds-section-odds-row p-3 border-b border-gray-800`}>
                <div
                  className={`${cn(
                    betEventDetailClassName,
                    'match-odds-section-odds-row-home-win'
                  )} flex justify-between items-center`}
                >
                  <div>
                    <span className="text-sm font-medium">0</span>
                    <span className="text-xs text-gray-400 ml-2">Draw</span>
                  </div>
                  {findOutcome(matchOddsMarket, 'Draw') && (
                    <button
                      onClick={() =>
                        handleBetSelect(
                          matchOddsMarket.key,
                          '1X2',
                          'Draw',
                          findOutcome(matchOddsMarket, 'Draw')?.price || 0
                        )
                      }
                      className={`rounded-full py-1 px-4 text-center font-medium transition-colors ${
                        isBetSelected(matchOddsMarket.key, 'Draw')
                          ? 'bg-green-500 text-black'
                          : 'bg-yellow-200 text-black hover:bg-yellow-300'
                      }`}
                    >
                      {findOutcome(matchOddsMarket, 'Draw')?.price.toFixed(2) || '-'}
                    </button>
                  )}
                </div>
              </div>

              <div className={`${betEventDetailClassName}-match-odds-section-odds-row p-3`}>
                <div
                  className={`${cn(
                    betEventDetailClassName,
                    'match-odds-section-odds-row-home-win'
                  )} flex justify-between items-center`}
                >
                  <div>
                    <span className="text-sm font-medium">2</span>
                    <span className="text-xs text-gray-400 ml-2">Away Win</span>
                  </div>
                  {findOutcome(matchOddsMarket, odds.away_team) && (
                    <button
                      onClick={() =>
                        handleBetSelect(
                          matchOddsMarket.key,
                          '1X2',
                          odds.away_team,
                          findOutcome(matchOddsMarket, odds.away_team)?.price || 0
                        )
                      }
                      className={`rounded-full py-1 px-4 text-center font-medium transition-colors ${
                        isBetSelected(matchOddsMarket.key, odds.away_team)
                          ? 'bg-green-500 text-black'
                          : 'bg-yellow-200 text-black hover:bg-yellow-300'
                      }`}
                    >
                      {findOutcome(matchOddsMarket, odds.away_team)?.price.toFixed(2) || '-'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {totalGoalsMarket && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-4">More Markets</h4>

              <div className={`${betEventDetailClassName}-total-goals-section mb-4`}>
                <div
                  className={`${cn(
                    betEventDetailClassName,
                    'total-goals-section-title'
                  )} text-sm font-medium text-gray-400 mb-2`}
                >
                  Total Goals Over/Under {totalGoalsMarket.outcomes[0]?.point || 2.5}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`${cn(
                      betEventDetailClassName,
                      'total-goals-section-odds-row'
                    )} bg-gray-800 rounded-md p-3 text-center`}
                  >
                    <div className="text-gray-400 text-sm mb-1">Under {totalGoalsMarket.outcomes[0]?.point || 2.5}</div>
                    {findOutcome(totalGoalsMarket, 'Under') && (
                      <button
                        onClick={() =>
                          handleBetSelect(
                            totalGoalsMarket.key,
                            `Total Goals Under/Over ${totalGoalsMarket.outcomes[0]?.point || 2.5}`,
                            'Under',
                            findOutcome(totalGoalsMarket, 'Under')?.price || 0
                          )
                        }
                        className={`inline-block rounded-full py-1 px-4 text-center font-medium transition-colors ${
                          isBetSelected(totalGoalsMarket.key, 'Under')
                            ? 'bg-green-500 text-black'
                            : 'bg-yellow-200 text-black hover:bg-yellow-300'
                        }`}
                      >
                        {findOutcome(totalGoalsMarket, 'Under')?.price.toFixed(2) || '-'}
                      </button>
                    )}
                  </div>
                  <div
                    className={`${cn(
                      betEventDetailClassName,
                      'total-goals-section-odds-row'
                    )} bg-gray-800 rounded-md p-3 text-center`}
                  >
                    <div className="text-gray-400 text-sm mb-1">Over {totalGoalsMarket.outcomes[0]?.point || 2.5}</div>
                    {findOutcome(totalGoalsMarket, 'Over') && (
                      <button
                        onClick={() =>
                          handleBetSelect(
                            totalGoalsMarket.key,
                            `Total Goals Under/Over ${totalGoalsMarket.outcomes[0]?.point || 2.5}`,
                            'Over',
                            findOutcome(totalGoalsMarket, 'Over')?.price || 0
                          )
                        }
                        className={`inline-block rounded-full py-1 px-4 text-center font-medium transition-colors ${
                          isBetSelected(totalGoalsMarket.key, 'Over')
                            ? 'bg-green-500 text-black'
                            : 'bg-yellow-200 text-black hover:bg-yellow-300'
                        }`}
                      >
                        {findOutcome(totalGoalsMarket, 'Over')?.price.toFixed(2) || '-'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {bookmakerMarkets.length > 3 && (
            <div>
              <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-4">
                Other Available Markets
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {bookmakerMarkets.slice(0, 5).map(
                  (market: IMarketProps) =>
                    market.key !== 'h2h' &&
                    market.key !== 'totals' && (
                      <div key={market.key} className="bg-gray-800 rounded-md p-3">
                        <div className="font-medium mb-2">{market.key.replace('_', ' ')}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {market.outcomes.slice(0, 4).map((outcome: IOutcomeProps) => (
                            <div key={outcome.name} className="flex justify-between items-center">
                              <div className="text-xs text-gray-400">{outcome.name}</div>
                              <button
                                onClick={() =>
                                  handleBetSelect(market.key, market.key.replace('_', ' '), outcome.name, outcome.price)
                                }
                                className={`rounded-full py-1 px-3 text-center font-medium text-sm transition-colors ${
                                  isBetSelected(market.key, outcome.name)
                                    ? 'bg-green-500 text-black'
                                    : 'bg-yellow-200 text-black hover:bg-yellow-300'
                                }`}
                              >
                                {outcome.price.toFixed(2)}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BetEventDetail;
