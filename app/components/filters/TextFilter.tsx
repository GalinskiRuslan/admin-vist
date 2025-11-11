"use client";

import styles from "./text-filter.module.css";

type TextFilterProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TextFilter = ({ title, value, onChange, placeholder }: TextFilterProps) => {
  return (
    <label className={styles.block}>
      <span className={styles.title}>{title}</span>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};
