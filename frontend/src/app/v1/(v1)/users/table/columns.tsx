"use client";

import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableFilterRows } from "@/components/custom/DataTable/filterRows";
import { stringFilterFn } from "@/components/custom/DataTable/functions";
import { DataTableSortColumn } from "@/components/custom/DataTable/sortColumns";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRoleEnum } from "@/core/enum/userRole";

interface GetColumnsProps {
  onEdit: (sample: responseUserSchemaType) => void;
  onDelete: (sample: responseUserSchemaType) => void;
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps) => {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Nome" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Nome",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Email" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Email",
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Cargo" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      cell: (props) => {
        const value = props.getValue() as UserRoleEnum;
        return value == UserRoleEnum.admin ? "Administrador" : "Editor";
      },
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Cargo",
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const sample = row.original;

        return (
          <div className=" w-full flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(sample)}
                  >
                    <Pencil className="text-zinc-400 size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(sample)}
                  >
                    <Trash className="text-red-600 size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ] as ColumnDef<responseUserSchemaType>[];
};
