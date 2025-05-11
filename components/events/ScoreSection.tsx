import React from 'react';
import { IScoreSectionProps } from '@/types/eventDetail';
import { cn } from '@/lib/utils';

const ScoreSection: React.FC<IScoreSectionProps> = ({ odds, isLive, formattedScore }) => {
  const scoreSectionClassName: string = 'bet-score-section';

  return (
    <div className={cn(`${scoreSectionClassName} flex justify-between items-center`)}>
      <div className={cn(`${scoreSectionClassName}-team-name text-lg font-medium`)}>{odds.home_team}</div>
      {isLive && (
        <div className={cn(`${scoreSectionClassName}-score font-bold text-2xl px-3 py-1`)}>{formattedScore}</div>
      )}
      <div className={cn(`${scoreSectionClassName}-team-name text-lg font-medium`)}>{odds.away_team}</div>
    </div>
  );
};

export default ScoreSection;
