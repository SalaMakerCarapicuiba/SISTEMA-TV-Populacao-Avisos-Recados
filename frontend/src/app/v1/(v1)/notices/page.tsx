"use client";

import { DatePickerWithRange } from "@/components/custom/DatePickerWithRange";
import { TimePickerWithRange } from "@/components/custom/TimePickerWithRange";
import { UpdateNoticeForm } from "@/components/layout/NoticeForm/update";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { deleteNoticeHandler } from "@/core/handlers/notice/delete.handler";
import { getAllNoticesHandler } from "@/core/handlers/notice/getNotices.handler";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import useDebounce from "@/hooks/useDebounce";
import { greet } from "@/util/greet";
import { getUserProfile } from "@/util/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { ZodError } from "zod";
import { filterDate } from "./filters/filterDate";
import { filterSearchBar } from "./filters/filterSearchBar";
import { filterTime } from "./filters/filterTime";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { CalendarView } from "./views/Calendar";
import { CardView } from "./views/Card";

import excelSvg from "@/assets/excel.svg";
import pdfSvg from "@/assets/pdf.svg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import * as XLSX from "xlsx";

export default function NoticesPage() {
  const router = useRouter();
  const [profile, setProfile] =
    useState<responseAuthenticationSchemaType | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] =
    useState<responseNoticeSchemaType | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // General texts
  const [searchValue, setSearchValue] = useState("");

  // Dates
  const [searchDate, setSearchDate] = useState<DateRange | undefined>(
    undefined,
  );

  // Times
  const [searchStartTimeValue, setSearchStartTimeValue] = useState("");
  const [searchEndTimeValue, setSearchEndTimeValue] = useState("");

  // Apply performance optimization
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const cleanFilters = () => {
    setSearchValue("");
    setSearchDate(undefined);
    setSearchStartTimeValue("");
    setSearchEndTimeValue("");
  };

  useEffect(() => {
    const user = getUserProfile();
    if (!user) router.replace("/v1/logout");
    else setProfile(user);
  }, [router]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<responseNoticeSchemaType[]>({
    queryKey: ["notices"],
    queryFn: async () =>
      await getAllNoticesHandler(profile, profile?.access ?? ""),
  });

  const deleteMutation = useMutation({
    mutationFn: async (notice: responseNoticeSchemaType) =>
      await deleteNoticeHandler(notice, profile?.access ?? ""),
    onSuccess: (id: string) => {
      if (id) {
        queryClient.setQueryData(
          ["notices"],
          (oldData: responseUserSchemaType[]) =>
            oldData.filter((data) => data.id !== id),
        );

        toast({
          title: "Exclusão de aviso",
          description: "Aviso foi deletado com sucesso!",
        });
      }
    },
    onMutate: () => handleCloseConfirmDialog(),
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao excluir um aviso",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  const handleDeletion = async () => {
    if (selectedRow?.id) {
      deleteMutation.mutate(selectedRow);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
    setSelectedRow(null);
  };

  const onEdit = (notice: responseNoticeSchemaType) => {
    setSelectedRow(notice);
    setIsEditFormOpen(true);
  };

  const onDelete = (notice: responseNoticeSchemaType) => {
    setSelectedRow(notice);
    setIsConfirmationDialogOpen(true);
  };

  const dataFiltered = filterTime(
    filterDate(filterSearchBar(data ?? [], debouncedSearchValue), searchDate),
    {
      start_time: searchStartTimeValue,
      end_time: searchEndTimeValue,
    },
  );

  const exportToExcel = () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.filter((notice) => notice.is_approved),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Avisos");
    XLSX.writeFile(workbook, "avisos.xlsx");
  };

  const exportToPDF = () => {
    if (!data) return;
    const doc = new jsPDF({
      orientation: "landscape",
      format: [405, 300],
      compress: true,
    });
    autoTable(doc, {
      tableWidth: "auto", // Fit the table to the page width
      margin: { top: 5, right: 5, bottom: 5, left: 5 }, // Decrease the padding
      head: [
        [
          "Assunto",
          "Local",
          "Categoria",
          "Subcategoria",
          "Conteúdo",
          "Data inicial",
          "Data final",
          "Tempo inicial",
          "Tempo final",
          "Aprovado",
          "Turno",
          "Curso",
        ],
      ],
      body: data
        .filter((notice) => notice.is_approved)
        .map((notice) => [
          notice.subject,
          notice.local,
          notice.category,
          notice.subcategory,
          notice.content,
          notice.start_date,
          notice.end_date,
          notice.start_time,
          notice.end_time,
          notice.is_approved ? "Sim" : "Não",
          ["Manhã", "Tarde", "Noite"]
            .map((item) => {
              if (item === "Manhã" && notice.share_morning) return "Manhã";
              if (item === "Tarde" && notice.share_afternoon) return "Tarde";
              if (item === "Noite" && notice.share_evening) return "Noite";

              return null;
            })
            .filter((item) => item !== null)
            .join(" | "),
          notice.interest_area,
        ]),
      styles: {
        fillColor: [255, 255, 255], // White background
        textColor: [0, 0, 0], // Black text
        lineColor: [0, 0, 0], // Black borders
        // Thin borders
      },
      headStyles: {
        fillColor: [50, 205, 50], // Lime green header background
        textColor: [255, 255, 255], // White header text
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light grey background for alternate rows
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Subject
        1: { cellWidth: 30 }, // Local
        2: { cellWidth: 30 }, // Category
        3: { cellWidth: 30 }, // Subcategory
        4: { cellWidth: 60 }, // Content
        5: { cellWidth: 30 }, // Start Date
        6: { cellWidth: 30 }, // End Date
        7: { cellWidth: 30 }, // Start Time
        8: { cellWidth: 30 }, // End Time
        9: { cellWidth: 24 }, // Is Approved
        10: { cellWidth: 30 }, // Period
        11: { cellWidth: 30 }, // Course
      },
    });
    doc.save("avisos.pdf");
  };

  return (
    <div className="w-full h-full flex flex-col items-stretch justify-between p-2">
      {/* Main content */}
      <div className=" flex-grow custom-scrollbar overflow-y-auto space-y-8 p-2">
        <header className=" w-full flex flex-row gap-4 items-center justify-between flex-wrap">
          {/* Greet Message */}
          <div className="flex-grow space-y-2">
            <h2 className="font-semibold text-xl">
              {greet()}, {profile?.full_name}
            </h2>
            <p className="font-normal text-sm text-foreground text-zinc-500">
              Bem-vindo ao sistema de população de avisos da Fatec de
              Carapicuíba
            </p>
          </div>
          {/* Export buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white"
              onClick={exportToExcel}
            >
              <Image
                src={excelSvg}
                alt="Excel Svg Icon"
                width={24}
                height={24}
              />
              <span>Exportar Excel</span>
            </Button>

            <Button
              variant="default"
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
              onClick={exportToPDF}
            >
              <Image src={pdfSvg} alt="Pdf Svg Icon" width={24} height={24} />
              <span>Exportar PDF</span>
            </Button>
          </div>
        </header>
        <main>
          <Tabs
            defaultValue="table"
            className="w-full"
            onValueChange={() => {
              cleanFilters();
            }}
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="table" className="w-full">
                Lista
              </TabsTrigger>
              <TabsTrigger value="cards" className="w-full">
                Cards
              </TabsTrigger>
              <TabsTrigger value="calendar" className="w-full">
                Calendário
              </TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <DataTable
                data={dataFiltered}
                isLoading={isLoading}
                columns={getColumns({
                  onEdit,
                  onDelete,
                  profile,
                  isGeneralPage: true,
                })}
              />
            </TabsContent>
            <TabsContent value="cards">
              <CardView
                data={dataFiltered}
                isLoading={isLoading}
                onEdit={onEdit}
                onDelete={onDelete}
                profile={profile}
              />
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarView
                data={dataFiltered}
                onEdit={onEdit}
                onDelete={onDelete}
                profile={profile}
              />
            </TabsContent>
          </Tabs>

          <UpdateNoticeForm
            isFormOpen={isEditFormOpen}
            setIsFormOpen={setIsEditFormOpen}
            selectedNotice={selectedRow}
            profile={profile}
            onClose={() => {
              setSelectedRow(null);
            }}
          />

          <Dialog
            open={isConfirmationDialogOpen}
            onOpenChange={setIsConfirmationDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deleção de registro.</DialogTitle>
                <DialogDescription className="mt-6">
                  <span>
                    Tem certeza que deseja deletar o registro{" "}
                    {selectedRow?.subject}
                  </span>

                  <span className="w-full flex items-center justify-end gap-4 mt-4">
                    <Button
                      onClick={handleCloseConfirmDialog}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleDeletion} variant="destructive">
                      Confirmar
                    </Button>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </main>
      </div>

      {/* Search Bar Footer */}
      <footer className="flex md:static lg:static relative bottom-10 pt-2">
        <div className="bg-secondary p-2 border-2 border-secondary rounded-lg overflow-hidden flex flex-row items-center gap-2 w-full">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Insira um nome ou email para filtrar"
            className="text-foreground group/item bg-secondary rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 px-2"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div className="flex flex-row items-center gap-4">
            <DatePickerWithRange date={searchDate} setDate={setSearchDate} />

            <TimePickerWithRange
              start_time={searchStartTimeValue}
              end_time={searchEndTimeValue}
              setStartTime={setSearchStartTimeValue}
              setEndTime={setSearchEndTimeValue}
            />

            <Button
              variant="default"
              disabled={searchValue === ""}
              className="flex flex-row items-center rounded-lg gap-2 max-w-[150px] h-12 text-background"
              onClick={() => setSearchValue("")}
            >
              <X className="size-6 text-background" />
              <span>Limpar</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
