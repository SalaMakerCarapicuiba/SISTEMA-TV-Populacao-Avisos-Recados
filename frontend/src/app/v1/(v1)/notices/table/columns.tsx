"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableFilterRows } from "@/components/custom/DataTable/filterRows";
import { stringFilterFn } from "@/components/custom/DataTable/functions";
import { DataTableSortColumn } from "@/components/custom/DataTable/sortColumns";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";

interface GetColumnsProps {
  onEdit: (sample: responseNoticeSchemaType) => void;
  onDelete: (sample: responseNoticeSchemaType) => void;
  isGeneralPage: boolean;
  profile: responseAuthenticationSchemaType | null;
}

export const getColumns = ({
  onEdit,
  onDelete,
  profile,
  isGeneralPage,
}: GetColumnsProps) => {
  return [
    {
      accessorKey: "user_name",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Autor" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),

      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Autor",
      },
    },
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Assunto" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Assunto",
      },
    },
    {
      accessorKey: "is_approved",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Aprovado" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      cell: (props) => {
        const isApproved = props.getValue() as boolean;
        return (
          <Badge
            className={`text-white ${isApproved ? "bg-lime-700" : "bg-red-700"}`}
          >
            {isApproved ? "Approvado" : "Negado"}
          </Badge>
        );
      },
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Aprovado",
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Categoria" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Categoria",
      },
    },
    {
      accessorKey: "subcategory",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Subcategoria" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Subcategoria",
      },
    },
    {
      accessorKey: "local",
      header: ({ column }) => (
        <div className=" flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Local" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Local",
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const notice = row.original;
        const isAdmin = profile?.role === UserRoleEnum.admin;

        return (
          <div className="w-full flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(notice)}
                    disabled={!isAdmin && isGeneralPage}
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
                    onClick={() => onDelete(notice)}
                    disabled={!isAdmin && isGeneralPage}
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
  ] as ColumnDef<responseNoticeSchemaType>[];
};
