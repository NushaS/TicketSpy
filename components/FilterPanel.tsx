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
      timeRange: { amount: 3, unit: 'weeks' },
      weekdays: { monThu: true, friSun: true },
      timesOfDay: { morning: true, afternoon: true, night: true },
    }
  );

  React.useEffect(() => {
    if (initialFilters) setLocal(initialFilters);
  }, [initialFilters]);

  if (!visible) return null;

  const setTimeRangeOption = (opt: '1-3w' | '3-6w' | '6-9m' | '9-12m') => {
    if (opt === '1-3w') setLocal((s) => ({ ...s, timeRange: { amount: 3, unit: 'weeks' } }));
    if (opt === '3-6w') setLocal((s) => ({ ...s, timeRange: { amount: 6, unit: 'weeks' } }));
    if (opt === '6-9m') setLocal((s) => ({ ...s, timeRange: { amount: 9, unit: 'months' } }));
    if (opt === '9-12m') setLocal((s) => ({ ...s, timeRange: { amount: 12, unit: 'months' } }));
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
            <h4>Time range (e.g., last)</h4>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 3 && local.timeRange?.unit === 'weeks'}
                  onChange={() => setTimeRangeOption('1-3w')}
                />{' '}
                1-3 weeks
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 6 && local.timeRange?.unit === 'weeks'}
                  onChange={() => setTimeRangeOption('3-6w')}
                />{' '}
                3-6 weeks
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 9 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('6-9m')}
                />{' '}
                6-9 months
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="time-range"
                  checked={local.timeRange?.amount === 12 && local.timeRange?.unit === 'months'}
                  onChange={() => setTimeRangeOption('9-12m')}
                />{' '}
                9-12 months
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

        <div style={{ padding: '1rem' }}>
          <button className={styles.applyFiltersButton} onClick={apply}>
            <Check size={16} />
            <span style={{ marginLeft: 8 }}>apply filters</span>
          </button>
        </div>
      </aside>
    </>
  );
}
