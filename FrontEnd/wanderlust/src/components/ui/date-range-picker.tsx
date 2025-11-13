"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";

interface DateRangePickerProps {
  mode?: "single" | "range";
  selected?: Date | { from?: Date; to?: Date };
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
  disabled?: (date: Date) => boolean;
  numberOfMonths?: number;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DateRangePicker({
  mode = "single",
  selected,
  onSelect,
  disabled,
  numberOfMonths = 1,
  className
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else {
      const range = selected as { from?: Date; to?: Date } | undefined;
      if (!range?.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined });
      } else if (date < range.from) {
        onSelect?.({ from: date, to: range.from });
      } else {
        onSelect?.({ from: range.from, to: date });
      }
    }
  };

  const isDateSelected = (date: Date): boolean => {
    if (mode === "single") {
      const selectedDate = selected as Date | undefined;
      return selectedDate ? isSameDay(date, selectedDate) : false;
    } else {
      const range = selected as { from?: Date; to?: Date } | undefined;
      if (!range?.from) return false;
      if (!range.to) return isSameDay(date, range.from);
      return isDateInRange(date, range.from, range.to);
    }
  };

  const isRangeStart = (date: Date): boolean => {
    if (mode !== "range") return false;
    const range = selected as { from?: Date; to?: Date } | undefined;
    return range?.from ? isSameDay(date, range.from) : false;
  };

  const isRangeEnd = (date: Date): boolean => {
    if (mode !== "range") return false;
    const range = selected as { from?: Date; to?: Date } | undefined;
    return range?.to ? isSameDay(date, range.to) : false;
  };

  const isRangeMiddle = (date: Date): boolean => {
    if (mode !== "range") return false;
    const range = selected as { from?: Date; to?: Date } | undefined;
    if (!range?.from || !range.to) return false;
    return date > range.from && date < range.to;
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const month = (currentMonth + monthOffset) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
      days.push(new Date(prevYear, prevMonth, daysInPrevMonth - firstDay + i + 1));
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push(new Date(nextYear, nextMonth, i));
    }

    return (
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          {monthOffset === 0 && (
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {monthOffset > 0 && <div className="w-9" />}
          
          <div className="font-semibold text-base">
            {MONTHS[month]} {year}
          </div>
          
          {monthOffset === numberOfMonths - 1 && (
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {monthOffset < numberOfMonths - 1 && <div className="w-9" />}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-12 min-w-[44px] flex items-center justify-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((date, index) => {
            if (!date) return <div key={index} />;
            
            const isOutside = date.getMonth() !== month;
            const isDisabled = disabled ? disabled(date) : false;
            const isSelected = isDateSelected(date);
            const isStart = isRangeStart(date);
            const isEnd = isRangeEnd(date);
            const isMiddle = isRangeMiddle(date);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                type="button"
                className={cn(
                  "h-12 min-w-[44px] w-full flex items-center justify-center text-sm rounded-lg transition-colors relative font-medium px-2",
                  isOutside && "text-gray-400",
                  !isOutside && !isDisabled && !isSelected && "hover:bg-blue-50 hover:text-blue-700",
                  isDisabled && "text-gray-300 cursor-not-allowed opacity-40",
                  isToday && !isSelected && "bg-blue-50 text-blue-700 font-semibold border-2 border-blue-300",
                  isSelected && !isStart && !isEnd && !isMiddle && "bg-blue-600 text-white font-bold hover:bg-blue-700 hover:text-white",
                  isStart && "bg-blue-600 text-white font-bold rounded-r-none hover:bg-blue-700 hover:text-white",
                  isEnd && "bg-blue-600 text-white font-bold rounded-l-none hover:bg-blue-700 hover:text-white",
                  isMiddle && "bg-blue-50 text-blue-900 rounded-none hover:bg-blue-100 hover:text-blue-900"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("bg-white p-6 rounded-lg", className)}>
      <div className={cn(
        "grid gap-8",
        numberOfMonths === 2 && "grid-cols-1 sm:grid-cols-2"
      )}>
        {Array.from({ length: numberOfMonths }).map((_, i) => (
          <div key={i}>
            {renderCalendar(i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateInRange(date: Date, from: Date, to: Date): boolean {
  const time = date.getTime();
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toTime = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return time >= fromTime && time <= toTime;
}
