"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column } from "@tanstack/react-table";
import { useState } from "react";
import { Filter } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { SquareX } from "lucide-react";

interface ColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  dataType: "string" | "number";
}

export enum filterOptions {
  equal = "equal",
  notEqual = "notEqual",
  greaterThan = "greaterThan",
  lessThan = "lessThan",
}

export function DataTableFilterRows<TData, TValue>({
  column,
  dataType,
}: ColumnFilterProps<TData, TValue>) {
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState<filterOptions>(
    filterOptions.equal,
  ); // Default filter type
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    column.setFilterValue({ filterType, value });
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilterValue("");
    column.setFilterValue(undefined); // Clear the filter in the column
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={filterValue ? "secondary" : "ghost"} size="icon">
          <EllipsisVertical size={20} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 w-[280px]">
        <div className="space-y-2">
          <Select
            onValueChange={(value: filterOptions) => {
              setFilterType(value);
            }}
            defaultValue={filterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o filtro" />
            </SelectTrigger>
            <SelectContent className="border-secondary">
              <SelectItem value={filterOptions.equal}>Igual</SelectItem>
              {dataType === "number" && (
                <>
                  <SelectItem value={filterOptions.greaterThan}>
                    Maior ou igual que
                  </SelectItem>
                  <SelectItem value={filterOptions.lessThan}>
                    Menor ou igual que
                  </SelectItem>
                </>
              )}
              <SelectItem value="notEqual">Diferente de</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="filtrar"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <Button
            variant="secondary"
            className="flex flex-grow items-center gap-2"
            onClick={() => handleFilterChange(filterValue)}
          >
            <Filter size={16} />
            Filtrar
          </Button>
          <Button
            variant="outline"
            className="flex flex-grow items-center gap-2"
            onClick={handleClear}
          >
            <SquareX size={16} />
            Limpar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
