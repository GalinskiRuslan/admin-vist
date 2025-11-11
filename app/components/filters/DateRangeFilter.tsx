import styles from "./date-range-filter.module.css";

type DateRangeFilterProps = {
  title: string;
  from: string;
  to: string;
  onChange: (range: [string, string]) => void;
};

export const DateRangeFilter = ({ title, from, to, onChange }: DateRangeFilterProps) => {
  return (
    <div className={styles.block}>
      <span className={styles.title}>{title}</span>
      <div className={styles.inputs}>
        <label className={styles.inputBlock}>
          <span>С</span>
          <input
            type="date"
            value={from}
            onChange={(event) => onChange([event.target.value, to])}
          />
        </label>
        <label className={styles.inputBlock}>
          <span>По</span>
          <input
            type="date"
            value={to}
            onChange={(event) => onChange([from, event.target.value])}
          />
        </label>
      </div>
    </div>
  );
};
