import { CSSProperties } from 'vue';


export type ITableHeader<T = unknown> = {
  label: string;
  key: keyof T | string;
  field?: (
    value: T extends Record<string, unknown> ? T[keyof T] : unknown,
    data: T,
    header: ITableHeader<T>,
    index: number,
  ) => string | number | boolean | Record<string, unknown> | void;
  left?: boolean;
  right?: boolean;
  class?: string | string[] | Record<string, string|number>;
  style?: string | string[] | CSSProperties;
  cellClass?: string | string[] | Record<string, string|number>;
  cellStyle?: string | string[] | CSSProperties;
  tooltipText?: string;
}
