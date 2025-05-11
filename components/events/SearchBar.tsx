'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { IEventSearchFiltersProps } from '@/types/event';
import { fetchSports, clearSportsError } from '@/store/slices/sportsSlice';
import { SearchInput } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (filters: IEventSearchFiltersProps) => void;
  initialFilters?: IEventSearchFiltersProps;
}

export default function SearchBar({ onSearch, initialFilters = {} }: SearchBarProps) {
  const todayFormatted = new Date().toISOString().split('T')[0];

  const defaultFilters = {
    ...initialFilters,
    fromDate: initialFilters.fromDate || todayFormatted,
    toDate: initialFilters.toDate || todayFormatted,
  };

  const dispatch = useDispatch();
  const [filters, setFilters] = useState<IEventSearchFiltersProps>(defaultFilters);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isHistoricalSearch, setIsHistoricalSearch] = useState(false);

  const { sports, loading, error } = useSelector((state: RootState) => state.sports);
  const isDatePast = (dateStr: string): boolean => {
    if (!dateStr) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    return date.getTime() < today.getTime();
  };

  const checkIfHistorical = (filters: IEventSearchFiltersProps) => {
    if (filters.fromDate && filters.toDate) {
      const isPastSearch = isDatePast(filters.fromDate) && isDatePast(filters.toDate);
      setIsHistoricalSearch(isPastSearch);
      return isPastSearch;
    }
    return false;
  };

  useEffect(() => {
    if (error && (error.includes('API key') || error.includes('401') || error.includes('403'))) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, [error]);

  useEffect(() => {
    if (sports.length === 0 && !loading) {
      dispatch(fetchSports() as any);
    }
  }, [dispatch, sports.length, loading, filters]);

  const sportsByGroup = useMemo(() => {
    const groups: Record<string, any[]> = {};

    const filteredSports = sports.filter((sport: any) => sport.has_outrights === false);

    filteredSports.forEach((sport: any) => {
      const group = sport.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(sport);
    });

    return groups;
  }, [sports]);

  const sortedGroups = useMemo(() => {
    return Object.entries(sportsByGroup)
      .map(([groupName, groupSports]) => ({
        groupName,
        groupSports,
        sportCount: groupSports.length,
      }))
      .sort((a, b) => b.sportCount - a.sportCount);
  }, [sportsByGroup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    if (name === 'fromDate' || name === 'toDate') {
      checkIfHistorical(newFilters);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      fromDate: todayFormatted,
      toDate: todayFormatted,
    });
    onSearch({
      fromDate: todayFormatted,
      toDate: todayFormatted,
    });
  };

  const handleRetry = () => {
    dispatch(clearSportsError() as any);
    dispatch(fetchSports() as any);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-black">
        <div>
          <SearchInput
            id="team"
            name="team"
            value={filters.team || ''}
            onChange={handleChange}
            placeholder="Search by team..."
            label="Team Name"
            fullWidth
            size="sm"
          />
        </div>

        <div>
          <label htmlFor="sportKey" className="block text-sm font-medium text-gray-700 mb-1">
            Sport
          </label>
          <select
            id="sportKey"
            name="sportKey"
            value={filters.sportKey || ''}
            onChange={handleChange}
            className={cn(
              ' rounded-md',
              'border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full'
            )}
            required
          >
            <option value="">All Sports</option>
            {loading ? (
              <option disabled>Loading sports...</option>
            ) : error && !apiKeyMissing ? (
              <option disabled>Error loading sports: {error}</option>
            ) : (
              sortedGroups.map(({ groupName, groupSports }) => (
                <optgroup key={groupName} label={groupName}>
                  {groupSports.map((sport: any) => (
                    <option key={sport.key} value={sport.key}>
                      {sport.title}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>

        <Button type="submit" variant="primary" size="sm">
          Search
        </Button>
      </div>
    </form>
  );
}
