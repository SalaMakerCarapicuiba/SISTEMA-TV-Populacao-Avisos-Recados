"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserRoleEnum } from "@/core/enum/userRole";
import { updateUserHandler } from "@/core/handlers/user/updateUser.handler";
import { responseUserSchemaType } from "@/core/models/user/responseUserSchema";
import {
  updateUserSchema,
  updateUserSchemaType,
} from "@/core/models/user/updateUserSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ZodError } from "zod";
import { Loader } from "lucide-react";
import { getUserProfile } from "@/util/profile";

interface UpdateUserFormProps {
  selectedUser: responseUserSchemaType | null;
  onClose: () => void;
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateUserForm({
  selectedUser,
  isFormOpen,
  onClose,
  setIsFormOpen,
}: UpdateUserFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const profile = getUserProfile();
  const form = useForm<updateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: "",
      is_approved: false,
      email: "",
      full_name: "",
      password: null,
      role: UserRoleEnum.editor,
    },
  });

  const fields = useWatch({ control: form.control });

  const handleClose = () => {
    setIsFormOpen(false);
    onClose();
    form.reset();
  };

  useEffect(() => {
    if (selectedUser) {
      form.setValue("id", selectedUser.id);
      form.setValue("is_approved", selectedUser.is_approved);
      form.setValue("full_name", selectedUser.full_name);
      form.setValue("email", selectedUser.email);
      form.setValue("role", selectedUser.role);
    }
  }, [selectedUser, form, setIsFormOpen]);

  const mutation = useMutation({
    mutationFn: async (values: updateUserSchemaType) =>
      await updateUserHandler(values, profile?.access ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["approved-users"] });

      toast({
        title: "Atualização de um usuário",
        description: "Usuário atualizado com sucesso!",
      });
      form.reset();
      setIsFormOpen(false);
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao atualizar um usuário`,
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent
        className=" w-full max-w-[500px]"
        onCloseAutoFocus={handleClose}
      >
        <DialogHeader>
          <DialogTitle>Formulário - Atualização de usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="flex flex-col items-stretch justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o nome do usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Insira seu email"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Insira sua senha"
                        {...field}
                        value={field.value ?? ""}
                        className=""
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do usuário</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full p-3 borde-0 rounded-md focus:outline-none bg-secondary h-14">
                        <SelectValue placeholder="Selecione o tipo do usuário" />
                      </SelectTrigger>
                      <SelectContent className="border-secondary">
                        <SelectItem value={UserRoleEnum.admin}>
                          Administrador
                        </SelectItem>
                        <SelectItem value={UserRoleEnum.editor}>
                          Editor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_approved"
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-center justify-between rounded-lg border transition-all duration-300 p-4 ${fields.is_approved ? "border-primary" : "border-destructive"}`}
                >
                  <div className="space-y-2">
                    <FormLabel className="text-base">
                      Usuário {fields.is_approved ? "aprovado" : "negado"}
                    </FormLabel>
                    <FormDescription>
                      Ao aprovar um usuário será liberado acesso e manipulação
                      de dados na plataforma.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 flex flex-row items-center gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader className="animate-spin size-4" />}
              {mutation.isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
