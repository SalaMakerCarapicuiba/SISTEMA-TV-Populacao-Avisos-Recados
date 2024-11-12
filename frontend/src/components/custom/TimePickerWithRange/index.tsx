import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, Filter, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimePickerWithRangeProps {
  start_time: string;
  end_time: string;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}

interface FormValues {
  start_time: string;
  end_time: string;
}

export function TimePickerWithRange({
  start_time,
  end_time,
  setStartTime,
  setEndTime,
}: TimePickerWithRangeProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      start_time,
      end_time,
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setStartTime(data.start_time);
    setEndTime(data.end_time);
    setIsOpen(false);
  };

  const resetFields = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-12 text-foreground">
          <Clock className=" size-6" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-stretch justify-start gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time:</Label>
            <Input
              id="start-time"
              type="time"
              {...register("start_time")}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time:</Label>
            <Input
              id="end-time"
              type="time"
              {...register("end_time")}
              className="h-10"
            />
          </div>

          <div className="w-full flex flex-row justify-end items-center gap-4">
            <Button
              variant="outline"
              onClick={resetFields}
              className="w-full flex items-center gap-2"
            >
              <X className="text-foreground size-4" />
              <span>Limpar</span>
            </Button>
            <Button type="submit" className="w-full flex items-center gap-2">
              <Filter className="size-4" />
              <span>Confirm</span>
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
