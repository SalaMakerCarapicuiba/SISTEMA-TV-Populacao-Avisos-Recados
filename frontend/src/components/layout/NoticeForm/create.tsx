import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createNoticeHandler } from "@/core/handlers/notice/createNotice.handler";
import {
  createNoticeSchema,
  createNoticeSchemaType,
} from "@/core/models/notice/createNoticeSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import { getUserProfile } from "@/util/profile";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CreateNoticeForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const profile = getUserProfile();

  const { toast } = useToast();

  const user = getUserProfile();

  const form = useForm<createNoticeSchemaType>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      content: "",
      image_url: null,
      subject: "",
      local: "",
      id_user: user?.id ?? "",
      is_approved: false,
      share_evening: false,
      share_morning: false,
      share_afternoon: false,
      interest_area: "",
    },
  });

  useEffect(() => {
    const user = getUserProfile();
    if (!user) {
      router.replace("/v1/logout");
    } else {
      form.setValue("id_user", user.id);
    }
  }, [form, router]);

  const handleCloseform = () => {
    setIsFormOpen(false);
    form.reset();
    setPreviewImage(null);
  };

  const handleOnSubmitMutation = useMutation({
    mutationFn: async (values: createNoticeSchemaType) =>
      await createNoticeHandler(values, profile?.access ?? ""),
    onSuccess: (ctx) => {
      queryClient.invalidateQueries({ queryKey: ["my-notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({
        title: "Aviso criado com sucesso",
        className: "bg-lime-500 text-foreground",
      });
      handleCloseform();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar aviso",
        description: error.message,
        className: "bg-red-500 border-red-950 text-foreground",
      });
    },
    mutationKey: ["notices"],
  });

  const fields = useWatch({ control: form.control }); // Watch for changes in image field

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setPreviewImage(reader.result as string); // Update preview using state
      };

      reader.readAsDataURL(file);
      form.setValue("image_url", file, { shouldDirty: true }); // Update form value
    } else {
      setPreviewImage(null);
      form.setValue("image_url", null, { shouldDirty: true }); // Remove value on no file
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-4 items-center w-full h-14 rounded-lg bg-lime-400 hover:bg-lime-600">
          <span className="text-black font-bold text-sm">Adicionar Aviso</span>
          <Plus className="text-black size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        onCloseAutoFocus={handleCloseform}
        className=" bg-background border-none p-0  w-full max-w-[800px] h-full md:max-h-[90dvh] overflow-y-auto custom-scrollbar"
      >
        <Form {...form}>
          <form
            className="space-y-4 p-4"
            onSubmit={form.handleSubmit((values) =>
              handleOnSubmitMutation.mutate(values),
            )}
          >
            <DialogHeader className="flex flex-row items-center justify-between pr-4">
              <DialogTitle>Criação de Aviso</DialogTitle>
            </DialogHeader>

            <Separator className="h-1 w-[200px] bg-lime-400 rounded-full" />

            <FormField
              control={form.control}
              name="id_user"
              render={({ field }) => (
                <FormItem defaultValue={50} className="opacity-0 hidden">
                  <FormLabel>Id do Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex flex-row items-center gap-2 pb-1">
                    <span className="text-foreground">Assunto</span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Insira o assunto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex flex-col sm:flex-row items-center justify-stretch gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Data Inicial</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-[52px]",
                              !field.value && "",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "do 'de' MMMM yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="text-foreground flex flex-row items-center gap-2 pb-1">
                      <span className="">Data Final</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-[52px]",
                              !field.value && " ",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "do 'de' MMMM yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-stretch gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className=" w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Horário Inicial</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="00h:00min"
                        {...field}
                        value={(field.value ?? "").slice(0, 5)}
                        onChange={(e) => onChange(e.target.value + ":00")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className=" w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Horário Final</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="00h:00min"
                        {...field}
                        value={(field.value ?? "").slice(0, 5)}
                        onChange={(e) => onChange(e.target.value + ":00")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sharing */}
            <FormField
              control={form.control}
              name="share_morning"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex flex-row items-center gap-2 pb-1">
                    <span className="text-foreground">
                      Período de interesse
                    </span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      className="w-full flex flex-row items-center gap-4 flex-wrap"
                      defaultValue={["morning", "afternoon", "evening"]
                        .map((item) => {
                          if (item === "morning" && fields.share_morning) {
                            return "morning";
                          }
                          if (item === "afternoon" && fields.share_afternoon) {
                            return "afternoon";
                          }
                          if (item === "evening" && fields.share_evening) {
                            return "evening";
                          }

                          return null;
                        })
                        .filter((item) => item !== null)}
                      onValueChange={(value) => {
                        form.setValue(
                          "share_morning",
                          value.includes("morning"),
                        );
                        form.setValue(
                          "share_afternoon",
                          value.includes("afternoon"),
                        );
                        form.setValue(
                          "share_evening",
                          value.includes("evening"),
                        );
                      }}
                    >
                      <ToggleGroupItem
                        value="morning"
                        className="flex-grow bg-secondary data-[state=on]:bg-orange-400/50"
                      >
                        Manhã
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="afternoon"
                        className="flex-grow bg-secondary data-[state=on]:bg-blue-400/50"
                      >
                        Tarde
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="evening"
                        className="flex-grow bg-secondary data-[state=on]:bg-purple-400/50"
                      >
                        Noite
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex flex-col sm:flex-row items-center justify-stretch gap-4">
              <FormField
                control={form.control}
                name="interest_area"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">
                        Curso de interesse
                      </span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Curso de interesse"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-stretch gap-4">
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Local</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Local do evento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-stretch gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Categoria</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel className=" lex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground">Subcategoria</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Subcategoria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel className="text-foreground flex flex-row items-center gap-2 pb-1">
                    <span>Conteúdo</span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className=" min-h-[150px]"
                      placeholder="Insira o conteúdo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <div className="w-full flex flex-row items-center gap-4">
                    <FormLabel className="text-foreground hover:text-white cursor-pointer min-w-[150px] text-center rounded-md bg-secondary p-4 hover:bg-[#111111] transition-all">
                      Escolher Imagem
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="hidden"
                        {...field}
                        value={""}
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    {fields.image_url && (
                      <span className="text-sm">
                        Arquivo selecionado:{" "}
                        <span className="text-primary">
                          {fields.image_url.name}
                        </span>
                      </span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewImage && (
              <Image
                src={previewImage}
                alt="choosen image"
                width={500}
                height={400}
                priority
                className="w-full object-cover object-center rounded-md shadow-md mx-auto"
              />
            )}

            <div className="bg-background sticky right-0 bottom-0 -m-4 p-4">
              <Button
                variant="default"
                type="submit"
                className="text-sm font-bold text-black w-full h-[52px] flex gap-4 items-center"
                disabled={handleOnSubmitMutation.isPending}
              >
                {handleOnSubmitMutation.isPending && (
                  <Loader className="size-6 " />
                )}
                {handleOnSubmitMutation.isPending ? "Criando" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
