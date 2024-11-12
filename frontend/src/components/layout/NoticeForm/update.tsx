import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { UserRoleEnum } from "@/core/enum/userRole";
import { approveNoticeHandler } from "@/core/handlers/notice/approveNotice.handler";
import { updateNoticeHandler } from "@/core/handlers/notice/updateNotice.handler";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import {
  updateNoticeSchema,
  updateNoticeSchemaType,
} from "@/core/models/notice/updateNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { formatDateFromAPI } from "@/util/setUTCHours";
import Image from "next/image";

interface UpdateNoticeFormProps {
  selectedNotice: responseNoticeSchemaType | null;
  onClose: () => void;
  isFormOpen: boolean;
  profile: responseAuthenticationSchemaType | null;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateNoticeForm({
  selectedNotice,
  onClose,
  isFormOpen,
  setIsFormOpen,
  profile,
}: UpdateNoticeFormProps) {
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<updateNoticeSchemaType>({
    resolver: zodResolver(updateNoticeSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      content: "",
      subject: "",
      local: "",
      start_time: "13:00:00",
      end_time: "18:00:00",
      start_date: new Date(),
      end_date: new Date(),
      id_user: profile?.id ?? "", // take dynamically
      is_approved: false,
      share_evening: false,
      share_morning: false,
      share_afternoon: false,
      interest_area: "",
    },
  });

  const fields = useWatch({ control: form.control }); // Watch for changes in image field
  const isApproved = selectedNotice?.is_approved;
  const isOwner = profile?.id === selectedNotice?.id_user;

  useEffect(() => {
    if (selectedNotice) {
      form.setValue("id", selectedNotice.id);
      form.setValue("content", selectedNotice.content);
      form.setValue("category", selectedNotice.category);
      form.setValue("subcategory", selectedNotice.subcategory);
      form.setValue("subject", selectedNotice.subject);
      form.setValue("local", selectedNotice.local);
      form.setValue("is_approved", selectedNotice.is_approved);
      form.setValue("start_date", formatDateFromAPI(selectedNotice.start_date));
      form.setValue("end_date", formatDateFromAPI(selectedNotice.end_date));
      if (selectedNotice.image_url) {
        setPreviewImage(selectedNotice.image_url.toString());
      }
      form.setValue("start_time", selectedNotice.start_time);
      form.setValue("end_time", selectedNotice.end_time);
      form.setValue("id_user", profile?.id ?? selectedNotice.id_user);

      form.setValue("share_morning", selectedNotice.share_morning ?? false);
      form.setValue("share_afternoon", selectedNotice.share_afternoon ?? false);
      form.setValue("share_evening", selectedNotice.share_evening ?? false);
      form.setValue("interest_area", selectedNotice?.interest_area ?? "");
    }
  }, [profile, selectedNotice]);

  const handleCloseform = () => {
    setIsFormOpen(false);
    form.reset();
    onClose();
    setPreviewImage(null);
  };

  const handleOnSubmitMutation = useMutation({
    mutationFn: async (values: updateNoticeSchemaType) =>
      await updateNoticeHandler(values, profile?.access ?? ""),
    onSuccess: (ctx) => {
      queryClient.invalidateQueries({ queryKey: ["my-notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });

      toast({
        title: "Aviso atualizado com sucesso",
        className: "bg-lime-500 text-foreground",
      });
      handleCloseform();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar aviso",
        description: error.message,
        className: "bg-red-500 border-red-950 text-foreground",
      });
    },
    mutationKey: ["notices"],
  });

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

  const approveNoticeMutation = useMutation({
    mutationFn: async (values: updateNoticeSchemaType) =>
      await approveNoticeHandler(values, profile?.access ?? ""),
    onSuccess: () => {
      toast({
        title: "Aviso atualizado",
      });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["my-notices"] });
      handleCloseform();
    },
    onError(error) {
      toast({
        title: "Erro ao aprovar aviso",
        description: error.message,
        className: "bg-red-500 border-red-950 text-foreground",
      });
    },
  });
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent
        onCloseAutoFocus={handleCloseform}
        className="bg-background border-none p-0 w-full max-w-[800px] h-full md:max-h-[90dvh] overflow-y-auto custom-scrollbar"
      >
        <Form {...form}>
          <form
            className="space-y-4 p-4"
            onSubmit={form.handleSubmit((values) =>
              handleOnSubmitMutation.mutate(values),
            )}
          >
            <DialogHeader className=" flex flex-row items-center justify-between pr-4">
              <DialogTitle className=" text-foreground">
                Atualização de Aviso
              </DialogTitle>
            </DialogHeader>

            <Separator className="h-1 w-[200px] bg-lime-400 rounded-full" />

            <FormField
              control={form.control}
              name="id_user"
              disabled={isApproved || !isOwner}
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

            <div className="flex flex-row items-center justify-start gap-2">
              <b className="text-primary">Autor: </b>{" "}
              <p>{selectedNotice?.user_name ?? "Sem autor"}</p>
            </div>

            {profile?.role === UserRoleEnum.admin && (
              <div
                className={`flex flex-row items-center justify-between rounded-lg border transition-all duration-300 p-4 ${fields.is_approved ? "border-primary" : "border-destructive"}`}
              >
                <div className="space-y-2">
                  <FormLabel className=" text-base">
                    Aviso {fields.is_approved ? "aprovado" : "negado"}
                  </FormLabel>
                  <FormDescription className="">
                    Ao aprovar um aviso, ele será liberado para visualização na
                    tela geral.
                  </FormDescription>
                </div>

                <Switch
                  checked={fields.is_approved}
                  onCheckedChange={(checked) => {
                    form.setValue("is_approved", checked);

                    const payload: any = {
                      ...fields,
                      is_approved: checked,
                    };

                    approveNoticeMutation.mutate(payload);
                  }}
                />
              </div>
            )}

            {isApproved && (
              <p className="text-bold text-left text-md mt-4 text-yellow-600">
                Edição habilitada apenas para o autor e se o aviso não estiver
                aprovado
              </p>
            )}

            <FormField
              control={form.control}
              name="subject"
              disabled={isApproved || !isOwner}
              render={({ field }) => (
                <FormItem className="text-foreground   w-full">
                  <FormLabel className="flex flex-row items-center gap-2 pb-1">
                    <span className="text-foreground  ">Assunto</span>
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
                disabled={isApproved || !isOwner}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground  ">Data Inicial</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={isApproved || !isOwner}>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            className={cn(
                              " text-foreground w-full pl-3 text-left font-normal h-[52px]",
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
                disabled={isApproved || !isOwner}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
                      <span className="text-foreground  ">Data Final</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={isApproved || !isOwner}>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            className={cn(
                              " text-foreground  w-full pl-3 text-left font-normal h-[52px]",
                              !field.value && "",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "do 'de' MMMM yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className=" ml-auto h-4 w-4 opacity-50" />
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
                disabled={isApproved || !isOwner}
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="w-full">
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
                        className="text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                disabled={isApproved || !isOwner}
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="w-full">
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
                        className=" text-foreground"
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
              disabled={isApproved || !isOwner}
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
                      disabled={isApproved || !isOwner}
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
                disabled={isApproved || !isOwner}
                render={({ field }) => (
                  <FormItem className="w-full">
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
                disabled={isApproved || !isOwner}
                render={({ field }) => (
                  <FormItem className="w-full">
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
                disabled={isApproved || !isOwner}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex flex-row items-center gap-2 pb-1">
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
              disabled={isApproved || !isOwner}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex flex-row items-center gap-2 pb-1">
                    <span className="text-foreground">Conteúdo</span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-foreground min-h-[150px]"
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
              disabled={isApproved || !isOwner}
              render={({ field }) => (
                <FormItem>
                  <div className="w-full flex flex-row items-center gap-4">
                    <FormLabel
                      className={cn(
                        "text-foreground hover:text-white cursor-pointer min-w-[150px] text-center rounded-md bg-secondary p-4 hover:bg-[#111111] transition-all",
                        isApproved || !isOwner
                          ? "cursor-not-allowed hover:bg-secondary hover:text-foreground opacity-50"
                          : "",
                      )}
                    >
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

            {previewImage !== null && (
              <Image
                src={previewImage}
                alt="choosen image"
                width={500}
                height={400}
                className="w-full object-cover object-center rounded-md shadow-md mx-auto"
              />
            )}
            <div className="bg-background sticky right-0 bottom-0 -m-4 p-4">
              <Button
                variant="default"
                type="submit"
                className="text-sm font-bold text-black w-full h-[52px] flex gap-4 items-center"
                disabled={handleOnSubmitMutation.isPending || isApproved}
              >
                {handleOnSubmitMutation.isPending && (
                  <Loader className="size-6 text-foreground" />
                )}
                {handleOnSubmitMutation.isPending ? "Atualizando" : "Atualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
