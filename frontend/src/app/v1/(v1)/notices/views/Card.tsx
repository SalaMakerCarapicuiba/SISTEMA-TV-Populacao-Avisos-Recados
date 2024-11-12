import { Button } from "@/components/ui/button";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Dot, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { format } from "date-fns";
import { formatDateFromAPI } from "@/util/setUTCHours";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CardViewProps {
  data: responseNoticeSchemaType[];
  isLoading: boolean;
  onEdit: (notice: responseNoticeSchemaType) => void;
  onDelete: (notice: responseNoticeSchemaType) => void;
  profile: responseAuthenticationSchemaType | null;
}

export function CardView({
  data,
  onEdit,
  onDelete,
  profile,
  isLoading,
}: CardViewProps) {
  const isAdmin = profile?.role === UserRoleEnum.admin;

  return (
    <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-4 p-2">
      {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <span>Carregando...</span>
        </div>
      ) : (
        data.map((notice) => {
          return (
            <Card
              key={notice.id}
              className="border-0 p-4 h-auto flex flex-col gap-4 justify-between items-stretch w-full"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 p-0">
                <CardTitle title={notice.subject} className="">
                  {notice.subject}
                </CardTitle>
                <Popover>
                  <PopoverTrigger>
                    <Button size="icon" variant="ghost">
                      <EllipsisVertical className="text-foreground size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto flex flex-row items-center gap-2 justify-start">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(notice)}
                      disabled={!isAdmin}
                      className="p-2"
                    >
                      <Pencil className="text-zinc-400 size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(notice)}
                      disabled={!isAdmin}
                      className="p-2"
                    >
                      <Trash className="text-red-600 size-4" />
                    </Button>
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p
                  title={notice.content}
                  className="text-ellipsis line-clamp-3 overflow-hidden text-justify"
                >
                  {notice.content}
                </p>
              </CardContent>

              <span
                className={` ${notice.is_approved ? "text-lime-500" : "text-red-500"}`}
              >
                {notice.is_approved ? "aprovado" : "não aprovado"}
              </span>

              <CardFooter className="p-0 flex flex-col flex-wrap md:flex-row justify-start items-center gap-2">
                <Badge className="flex flex-row gap-2 justify-center items-center">
                  <p>
                    {format(formatDateFromAPI(notice.start_date), "dd/MM/yyyy")}
                  </p>
                  <span>{notice.start_time.slice(0, 5).replace(":", "h")}</span>
                </Badge>

                <Badge
                  variant="destructive"
                  className="flex flex-row gap-2 justify-center items-center"
                >
                  <p>
                    {format(formatDateFromAPI(notice.end_date), "dd/MM/yyyy")}
                  </p>
                  <span>{notice.end_time.slice(0, 5).replace(":", "h")}</span>
                </Badge>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
}
