import React from 'react';
import { X, Check } from 'lucide-react';
import styles from '../app/page.module.css';
import type { Filters } from '@/lib/utils/filterTickets';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: Filters) => void;
  initialFilters?: Filters | undefined;
};

export default function FilterPanel({ visible, onClose, onApply, initialFilters }: Props) {
  const [local, setLocal] = React.useState<Filters>(
    initialFilters ?? {
      timeRange: { amount: 1, unit: 'months' },
      weekdays: { monThu: true, friSun: true },
      timesOfDay: { morning: true, afternoon: true, night: true },
    }
  );

  React.useEffect(() => {
    if (initialFilters) setLocal(initialFilters);
  }, [initialFilters]);

  if (!visible) return null;

  const setTimeRangeOption = (opt: '1w' | '2w' | '3w' | '1m' | '3m' | '6m' | '1y') => {
    if (opt === '1w') setLocal((s) => ({ ...s, timeRange: { amount: 1, unit: 'weeks' } }));
    if (opt === '2w') setLocal((s) => ({ ...s, timeRange: { amount: 2, unit: 'weeks' } }));
    if (opt === '3w') setLocal((s) => ({ ...s, timeRange: { amount: 3, unit: 'weeks' } }));
    if (opt === '1m') setLocal((s) => ({ ...s, timeRange: { amount: 1, unit: 'months' } }));
    if (opt === '3m') setLocal((s) => ({ ...s, timeRange: { amount: 3, unit: 'months' } }));
    if (opt === '6m') setLocal((s) => ({ ...s, timeRange: { amount: 6, unit: 'months' } }));
    if (opt === '1y') setLocal((s) => ({ ...s, timeRange: { amount: 12, unit: 'months' } }));
  };

  const toggleWeekday = (key: keyof NonNullable<Filters['weekdays']>) =>
    setLocal((s) => ({
      ...s,
      weekdays: {
        ...(s.weekdays ?? { monThu: false, friSun: false }),
        [key]: !(s.weekdays?.[key] ?? false),
      },
    }));

  const toggleTimeOfDay = (key: keyof NonNullable<Filters['timesOfDay']>) =>
    setLocal((s) => ({
      ...s,
      timesOfDay: {
        ...(s.timesOfDay ?? { morning: false, afternoon: false, night: false }),
        [key]: !(s.timesOfDay?.[key] ?? false),
      },
    }));

  const apply = () => {
    onApply?.(local);
    onClose();
  };

  return (
    <>
      <div className={styles.filterPanelOverlay} onClick={onClose} />

      <aside className={styles.filterPanel} role="dialog" aria-modal="true" aria-label="filters">
        <div className={styles.filterPanelHeader}>
          <h3>filters</h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="close filters">
            <X size={18} />
          </button>
        </div>

        <div className={styles.filterPanelBody}>
          <section className={styles.filterSection}>
            <h4>Time range</h4>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 1 && local.timeRange?.unit === 'weeks'}
                  onChange={() => setTimeRangeOption('1w')}
                />{' '}
                Past 1 week
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 2 && local.timeRange?.unit === 'weeks'}
                  onChange={() => setTimeRangeOption('2w')}
                />{' '}
                Past 2 weeks
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 3 && local.timeRange?.unit === 'weeks'}
                  onChange={() => setTimeRangeOption('3w')}
                />{' '}
                Past 3 weeks
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 1 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('1m')}
                />{' '}
                Past 1 month
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 3 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('3m')}
                />{' '}
                Past 3 months
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 6 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('6m')}
                />{' '}
                Past 6 months
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 12 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('1y')}
                />{' '}
                Past 1 year
              </label>
            </div>
          </section>

          <section className={styles.filterSection}>
            <h4>Week/weekend</h4>
            <label>
              <input
                type="checkbox"
                checked={!!local.weekdays?.monThu}
                onChange={() => toggleWeekday('monThu')}
              />{' '}
              Monday - Thursday
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!local.weekdays?.friSun}
                onChange={() => toggleWeekday('friSun')}
              />{' '}
              Friday - Sunday
            </label>
          </section>

          <section className={styles.filterSection}>
            <h4>Time of day</h4>
            <label>
              <input
                type="checkbox"
                checked={!!local.timesOfDay?.morning}
                onChange={() => toggleTimeOfDay('morning')}
              />{' '}
              Morning: 6am - 12pm
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!local.timesOfDay?.afternoon}
                onChange={() => toggleTimeOfDay('afternoon')}
              />{' '}
              Afternoon: 12pm - 6pm
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!local.timesOfDay?.night}
                onChange={() => toggleTimeOfDay('night')}
              />{' '}
              Night: 6pm - 6am
            </label>
          </section>
        </div>

        <div className={styles.filterPanelFooter}>
          <button className={styles.applyFiltersButton} onClick={apply}>
            <Check size={16} />
            <span style={{ marginLeft: 8 }}>apply filters</span>
          </button>
        </div>
      </aside>
    </>
  );
}
