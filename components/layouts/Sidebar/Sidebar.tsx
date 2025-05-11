import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setSelectedSportId } from '@/store/slices/eventsSlice';
import { AppDispatch } from '@/store';
import SportGroupComponent from './SportGroupComponent';
import type { ISportProps, ISportGroupProps } from '@/types/sidebar';

const Sidebar: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { sports } = useAppSelector(state => state.sports);
  const { selectedSportId } = useAppSelector(state => state.events);

  const sportsByGroup = React.useMemo((): Record<string, ISportProps[]> => {
    const groups: Record<string, ISportProps[]> = {};
    const filteredSports = sports.filter((sport) => !(sport as ISportProps).has_outrights);

    filteredSports.forEach((sport) => {
      const group = (sport as ISportProps).group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(sport as ISportProps);
    });

    return groups;
  }, [sports]);

  const sortedGroups = React.useMemo((): ISportGroupProps[] => {
    return Object.entries(sportsByGroup)
      .map(([groupName, groupSports]) => ({
        groupName,
        groupSports,
        sportCount: groupSports.length,
      }))
      .sort((a, b) => b.sportCount - a.sportCount);
  }, [sportsByGroup]);

  const handleSportSelect = (sportId: string): void => {
    dispatch(setSelectedSportId(sportId));
  };

  useEffect((): void => {
    if (sortedGroups.length > 0 && sortedGroups[0].groupSports.length > 0 && !selectedSportId) {
      const firstSport = sortedGroups[0].groupSports[0];
      handleSportSelect(firstSport.key);
    }
  }, [sortedGroups, selectedSportId]);

  return (
    <aside className="bet-app-sidebar-container w-1/5 text-text overflow-y-auto">
      <nav className="bet-app-sidebar-nav mt-2 overflow-y-scroll h-screen">
        {sortedGroups.map(group => (
          <SportGroupComponent
            group={group}
            key={group.groupName}
            selectedSportId={selectedSportId}
            onSportSelect={handleSportSelect}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
