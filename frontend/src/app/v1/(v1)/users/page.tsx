"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPen, UserRoundCheck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import { greet } from "@/util/greet";
import { getUserProfile } from "@/util/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UpdateUserForm } from "./forms/update";
import { ApprovedUsersTable } from "./tabs/ApprovedUsers";
import { PendingUsersTable } from "./tabs/PendingUsers";

import excelSvg from "@/assets/excel.svg";
import pdfSvg from "@/assets/pdf.svg";
import { useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import * as XLSX from "xlsx";

export default function UsersPage() {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const router = useRouter();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] =
    useState<responseUserSchemaType | null>(null);
  const [profile, setProfile] =
    useState<responseAuthenticationSchemaType | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("pending");

  const [approvedUsers, setApprovedUsers] = useState<responseUserSchemaType[]>(
    [],
  );

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const user = getUserProfile();
    if (!user) router.replace("/v1/logout");
    if (user?.role !== UserRoleEnum.admin) router.back();
    else setProfile(user);
  }, [router]);

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
    setSelectedUser(null);
  };

  const onEdit = (users: responseUserSchemaType) => {
    setSelectedUser(users);
    setIsEditFormOpen(true);
  };

  const onDelete = (users: responseUserSchemaType) => {
    setSelectedUser(users);
    setIsConfirmationDialogOpen(true);
  };

  const exportToExcel = () => {
    if (!approvedUsers) return;
    const worksheet = XLSX.utils.json_to_sheet(approvedUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios Aprovados");
    XLSX.writeFile(workbook, "usuarios-aprovados.xlsx");
  };

  const exportToPDF = () => {
    if (!approvedUsers) return;
    const doc = new jsPDF({
      orientation: "landscape",
      compress: true,
    });
    autoTable(doc, {
      tableWidth: "auto", // Fit the table to the page width
      margin: { top: 5, right: 5, bottom: 5, left: 5 }, // Decrease the padding
      head: [
        ["Nome", "E-mail", "Área", "Criado em", "Atualizado em", "Aprovado"],
      ],
      body: approvedUsers.map((user) => [
        user.full_name,
        user.email,
        user.role,
        user.created_at as any,
        user.updated_at as any,
        user.is_approved,
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
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 70 },
        4: { cellWidth: 70 },
        5: { cellWidth: 20 },
      },
    });
    doc.save("usuarios-aprovados.pdf");
  };

  const handleChangeApprovedUsers = (
    approvedUsersList: responseUserSchemaType[],
  ) => {
    setApprovedUsers(approvedUsersList);
  };

  return (
    <div className="w-full h-full flex flex-col items-stretch justify-between p-4">
      {/* Main content */}
      <div className=" flex-grow custom-scrollbar overflow-y-auto space-y-8">
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
          {selectedTab === "approved" && (
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
          )}
        </header>

        <main>
          <Tabs
            defaultValue="pending"
            className="flex flex-col items-stretch justify-start gap-4 w-full"
            onValueChange={(tabName) => {
              setSelectedTab(tabName);
              setSearchValue("");
            }}
          >
            <TabsList>
              <TabsTrigger
                value="pending"
                className="w-full flex flex-row items-center gap-4"
              >
                <UserPen className="size-6" />
                <span>Pendentes</span>
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="w-full flex flex-row items-center gap-4"
              >
                <UserRoundCheck className="size-6" />
                <span>Aprovados</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <PendingUsersTable
                userSelected={selectedUser}
                onEdit={onEdit}
                onDelete={onDelete}
                handleCloseConfirmDialog={handleCloseConfirmDialog}
                isConfirmationDialogOpen={isConfirmationDialogOpen}
                setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
                searchBarValue={searchValue}
              />
            </TabsContent>
            <TabsContent value="approved">
              <ApprovedUsersTable
                userSelected={selectedUser}
                onEdit={onEdit}
                onDelete={onDelete}
                handleCloseConfirmDialog={handleCloseConfirmDialog}
                isConfirmationDialogOpen={isConfirmationDialogOpen}
                setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
                searchBarValue={searchValue}
                onLoadApprovedUsers={handleChangeApprovedUsers}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <UpdateUserForm
        isFormOpen={isEditFormOpen}
        setIsFormOpen={setIsEditFormOpen}
        selectedUser={selectedUser}
        onClose={() => {
          setSelectedUser(null);
        }}
      />

      {/* Search Bar Footer */}
      <footer>
        <div className="flex flex-row items-center gap-2 w-full">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Insira um nome ou email para filtrar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="group/item rounded-lg p-4"
          />

          <div className="flex flex-row items-center gap-4">
            <Button
              variant="default"
              className="flex flex-row items-center rounded-lg gap-2 max-w-[150px] h-12 text-background"
            >
              <Search className="size-6 bg-green text-background" />
              <span>Buscar</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
