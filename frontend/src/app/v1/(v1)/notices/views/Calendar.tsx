import { Button } from "@/components/ui/button";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import { cn } from "@/lib/utils";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal.js";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import FullCalendar from "@fullcalendar/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Trash } from "lucide-react";
import { useTheme } from "next-themes";

interface CalendarViewProps {
  data: responseNoticeSchemaType[];
  onEdit: (notice: responseNoticeSchemaType) => void;
  onDelete: (notice: responseNoticeSchemaType) => void;
  profile: responseAuthenticationSchemaType | null;
}

export function CalendarView({
  data,
  onEdit,
  onDelete,
  profile,
}: CalendarViewProps) {
  const { theme } = useTheme();

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        viewClassNames=""
        eventBackgroundColor="#8DE459"
        eventBorderColor="#3d8513"
        eventTextColor="#181818"
        eventClassNames="rounded-md px-2"
        weekends={true}
        locale={"pt-br"}
        headerToolbar={{
          left: "title",
          center: "",
          right: "today,prev,next",
        }}
        eventContent={renderEventContent}
        events={data.map((notice) => ({
          id: notice.id,
          title: notice.subject,
          date: notice.start_date,
          start: notice.start_date,
          end: notice.end_date,
          interactive: true,
          allDay: true,
          extendedProps: {
            onEdit,
            onDelete,
            profile,
            data: notice,
          },
        }))}
      />
    </div>
  );
}

function renderEventContent(
  eventInfo: EventContentArg & {
    event: EventImpl & { extendedProps: Omit<CalendarViewProps, "data"> };
  },
) {
  const notice = eventInfo.event.extendedProps.data;

  const onEdit = eventInfo.event.extendedProps.onEdit;
  const onDelete = eventInfo.event.extendedProps.onDelete;
  const profile = eventInfo.event.extendedProps.profile;

  const isAdmin = profile?.role === UserRoleEnum.admin;

  return (
    <Popover>
      <PopoverTrigger className="w-full flex flex-col justify-start items-start gap-2">
        <b
          title={eventInfo.event.title}
          className="w-full text-left text-ellipsis truncate"
        >
          {eventInfo.event.title}
        </b>
        <p
          title={eventInfo.event.startStr}
          className="w-full text-left text-ellipsis truncate"
        >
          {eventInfo.event.startStr}
        </p>
      </PopoverTrigger>
      <PopoverContent className="w-auto flex flex-col items-center gap-5 justify-center">
        <Button
          variant="ghost"
          onClick={() => onEdit(notice)}
          disabled={!isAdmin}
          className="flex flex-row items-center gap-2"
        >
          <Pencil className="text-zinc-400 size-6" />
          <span>Editar</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => onDelete(notice)}
          disabled={!isAdmin}
          className="flex flex-row items-center gap-2"
        >
          <Trash className="text-red-600 size-6" />
          <span>Deletar</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
