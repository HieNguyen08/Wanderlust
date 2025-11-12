"use client";

import * as React from "react";
import { DateRangePicker } from "./date-range-picker";

export type CalendarProps = {
  mode?: "single" | "range";
  selected?: Date | { from?: Date; to?: Date };
  onSelect?: (date: any) => void;
  disabled?: (date: Date) => boolean;
  numberOfMonths?: number;
  className?: string;
};

function Calendar(props: CalendarProps) {
  return <DateRangePicker {...props} />;
}

export { Calendar };
