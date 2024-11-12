/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteUserHandler } from "@/core/handlers/user/delete.handler";
import { getApprovedUsersHandler } from "@/core/handlers/user/getUsers.handler";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import { getUserProfile } from "@/util/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ZodError } from "zod";
import { getColumns } from "../../table/columns";
import { DataTable } from "../../table/data-table";

interface ApprovedUsersTableProps {
  onEdit: (user: responseUserSchemaType) => void;
  onDelete: (user: responseUserSchemaType) => void;
  isConfirmationDialogOpen: boolean;
  setIsConfirmationDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleCloseConfirmDialog: () => void;
  userSelected: responseUserSchemaType | null;
  searchBarValue: string;
  onLoadApprovedUsers: (users: responseUserSchemaType[]) => void;
}

export function ApprovedUsersTable({
  userSelected,
  onEdit,
  onDelete,
  isConfirmationDialogOpen,
  setIsConfirmationDialogOpen,
  handleCloseConfirmDialog,
  searchBarValue,
  onLoadApprovedUsers,
}: ApprovedUsersTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const profile = getUserProfile();
  const { data, isLoading, isError, error } = useQuery<
    responseUserSchemaType[]
  >({
    queryKey: ["approved-users"],
    queryFn: async () => await getApprovedUsersHandler(profile?.access),
  });

  useEffect(() => {
    if (data && !isLoading) {
      onLoadApprovedUsers(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Erro ao buscar usuários",
        description: error?.message,
        className: "bg-red-500 border-red-950 text-foreground",
      });
    }
  }, [error]);

  const deleteMutation = useMutation({
    mutationFn: async (user: responseUserSchemaType) =>
      await deleteUserHandler(user, profile?.access ?? ""),
    onSuccess: (id: string) => {
      if (id) {
        queryClient.setQueryData(
          ["approved-users"],
          (oldData: responseUserSchemaType[]) =>
            oldData.filter((data) => data.id !== id),
        );

        toast({
          title: "Exclusão de usuário",
          description: "Usuário foi deletado com sucesso!",
        });
      }
    },
    onMutate: () => handleCloseConfirmDialog(),
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao excluir um usuário",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  const handleDeletion = async () => {
    if (userSelected?.id) {
      deleteMutation.mutate(userSelected);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Data Table */}
      <DataTable
        isLoading={isLoading}
        columns={getColumns({
          onEdit,
          onDelete,
        })}
        data={(data ?? []).filter((item) => {
          const { email, full_name, role } = item;

          const lowercaseEmail = email.toLowerCase();
          const lowercaseFullName = full_name.toLowerCase();
          const lowercaseRole = role.toString().toLowerCase();

          return (
            lowercaseEmail.includes(searchBarValue.toLowerCase()) ||
            lowercaseFullName.includes(searchBarValue.toLowerCase()) ||
            lowercaseRole.includes(searchBarValue.toLowerCase())
          );
        })}
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
                Tem certeza que deseja deletar o registro de email{" "}
                {userSelected?.email}
              </span>

              <span className="w-full flex items-center justify-end gap-4 mt-4">
                <Button onClick={handleCloseConfirmDialog} variant="outline">
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
    </div>
  );
}