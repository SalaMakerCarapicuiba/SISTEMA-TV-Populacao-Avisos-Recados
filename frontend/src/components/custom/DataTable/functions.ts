import { FilterFn } from "@tanstack/react-table";
import { filterOptions } from "./filterRows";

// Custom filter function for numbers
export const numberFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const { filterType, value } = filterValue;
  const rowValue = row.getValue(columnId);

  if (!rowValue) return true;

  switch (filterType) {
    case filterOptions.greaterThan:
      return Number(rowValue) >= Number(value);
    case filterOptions.lessThan:
      return Number(rowValue) <= Number(value);
    case filterOptions.notEqual:
      return Number(rowValue) !== Number(value);
    default:
      return Number(rowValue) === Number(value);
  }
};

// Custom filter function for strings
export const stringFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const { filterType, value } = filterValue;
  const rowValue = String(row.getValue(columnId)).toLowerCase();
  const filterVal = String(value).toLowerCase();

  switch (filterType) {
    case filterOptions.notEqual:
      return !rowValue.includes(filterVal);
    default:
      return rowValue.includes(filterVal);
  }
};
