"use client";

import { useMutation } from "@tanstack/react-query";

import {
  authenticateSchema,
  authenticateSchemaType,
} from "@/core/models/user/authenticate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authenticate } from "@/core/handlers/user/login.handler";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";

import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { AxiosError } from "axios";
import cookie from "js-cookie";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<authenticateSchemaType>({
    resolver: zodResolver(authenticateSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const handleMutationSubmit = useMutation({
    mutationFn: authenticate,
    onSuccess: async (authenticatedUser: responseAuthenticationSchemaType) => {
      toast({
        title: "Autenticado com sucesso!",
        description: "Você será redirecionado em instantes",
        className: "bg-lime-500 border-lime-900 text-white",
      });

      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      cookie.set("authenticated_user", JSON.stringify(authenticatedUser), {
        expires,
        secure: true,
      });

      router.push("/v1/notices");
    },
    onError: (error) => {
      let errorMessage = error.message;
      if (error instanceof AxiosError)
        errorMessage = error?.response?.data.detail;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao se autenticar`,
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleMutationSubmit.mutate(values),
          )}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" ">E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Insira seu E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className=" ">Senha</FormLabel>
                </div>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Insira sua senha"
                      className="w-full pr-6"
                      {...field}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword((show) => !show)}
                      className="p-2 absolute top-1/2 right-2 translate-y-[-50%]"
                    >
                      {showPassword ? (
                        <EyeOff className="size-6 text-zinc-500" />
                      ) : (
                        <Eye className="size-6 text-zinc-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={handleMutationSubmit.isPending}
            className="w-full h-[56px] disabled:bg-gray-600 flex flex-row items-center justify-center gap-4 disabled:text-white rounded-sm font-bold bg-lime-400 hover:bg-lime-600 text-black shadow-md active:scale-95 transition-all"
          >
            <LoaderIcon
              className={`size-6 text-white animate-spin ${!handleMutationSubmit.isPending && "hidden"}`}
            />
            <span>Entrar</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
