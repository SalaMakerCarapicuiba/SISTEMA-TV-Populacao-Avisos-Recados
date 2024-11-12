"use client";

import {
  createUserSchema,
  createUserSchemaType,
} from "@/core/models/user/createUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createUserHandler } from "@/core/handlers/user/createUser.handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { ZodError } from "zod";
import { getUserProfile } from "@/util/profile";

export function CreateUserForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const profile = getUserProfile();

  const form = useForm<createUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      role: UserRoleEnum.editor,
    },
  });

  const handleClose = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const mutation = useMutation({
    mutationFn: async (values: createUserSchemaType) =>
      await createUserHandler(values, profile?.access ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      toast({
        title: "Criação de um usuário",
        description: "Usuário criado com sucesso!",
      });
      form.reset();
      setIsFormOpen(false);
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao criar um usuário`,
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-foreground",
      });
    },
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-4 items-center w-full h-14 rounded-lg bg-lime-400 hover:bg-lime-600">
          <span className="text-black font-bold text-sm">
            Adicionar usuário
          </span>
          <Plus className="text-black size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className=" w-full max-w-[500px]"
        onCloseAutoFocus={handleClose}
      >
        <DialogHeader>
          <DialogTitle>Formulário - Criação de usuário</DialogTitle>
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
                    <FormLabel className="text-foreground">
                      Nome completo
                    </FormLabel>
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
                    <FormLabel className="text-foreground">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Insira seu email"
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
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-foreground">Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Insira sua senha"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Tipo do usuário
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className=" w-full p-3 borde-0 rounded-md focus:outline-none bg-secondary h-14">
                        <SelectValue placeholder="Selecione o tipo do usuário" />
                      </SelectTrigger>
                      <SelectContent className="border-secondary ">
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

            <Button type="submit" className=" mt-4 flex items-center gap-4">
              {mutation.isPending && <Loader className="animate-spin size-4" />}
              {mutation.isPending ? "Criando..." : "Criar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
