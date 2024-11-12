"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, CalendarSearch } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClearSelection = () => {
    setDate(undefined);
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <div className={cn("grid gap-2", className)}>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  id="date"
                  variant="ghost"
                  className={cn("h-12", !date && "text-foreground")}
                >
                  <CalendarSearch className=" size-6" />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={ptBR}
              />
              <div className="w-full flex items-center justify-end">
                <Button variant="secondary" onClick={handleClearSelection}>
                  Limpar seleção
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <TooltipContent className="p-4 flex flex-row items-center gap-4">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
