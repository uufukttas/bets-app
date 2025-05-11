import React from 'react';
import SportItem from './SportItem';
import { ISportGroupComponentProps, ISportProps } from '@/types/sidebar';
import { cn } from '@/lib/utils';

const SportGroupComponent: React.FC<ISportGroupComponentProps> = ({
  group,
  selectedSportId,
  onSportSelect,
}: ISportGroupComponentProps) => {
  const sportGroupClassName: string = 'bet-app-sidebar-group';

  return (
    <div className={cn(`${sportGroupClassName} mb-4`)}>
      <div
        className={cn(
          `${sportGroupClassName}-header px-4 py-2 bg-gray-600 font-medium text-gray-200 flex justify-between`
        )}
      >
        <span className={cn(`${sportGroupClassName}-header-name`)}>{group.groupName}</span>
        <span className={cn(`${sportGroupClassName}-header-count text-xs bg-gray-700 rounded px-2 py-1`)}>
          {group.sportCount}
        </span>
      </div>
      <ul className={cn(`${sportGroupClassName}-list`)}>
        {group.groupSports.map((sport: ISportProps) => (
          <SportItem
            isSelected={selectedSportId === sport.key}
            key={sport.key}
            sport={sport}
            onSelect={onSportSelect}
          />
        ))}
      </ul>
    </div>
  );
};

export default SportGroupComponent;
