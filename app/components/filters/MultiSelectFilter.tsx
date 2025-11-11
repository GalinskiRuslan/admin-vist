"use client";

import styles from "./multi-select-filter.module.css";

type Option = {
  label: string;
  value: string;
};

type MultiSelectFilterProps = {
  title: string;
  options: Option[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  helperText?: string;
};

export const MultiSelectFilter = ({
  title,
  options,
  selected,
  onChange,
  helperText,
}: MultiSelectFilterProps) => {
  const toggleValue = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onChange(next);
  };

  return (
    <div className={styles.block}>
      <span className={styles.title}>{title}</span>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="checkbox"
              checked={selected.has(option.value)}
              onChange={() => toggleValue(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {helperText ? <p className={styles.helper}>{helperText}</p> : null}
    </div>
  );
};
