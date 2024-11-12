import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";
import { formatDateFromAPI } from "@/util/setUTCHours";
import { DateRange } from "react-day-picker";

export function filterDate(
  data: responseNoticeSchemaType[],
  date: DateRange | undefined,
) {
  if (date?.from && date?.to) {
    return data.filter((item) => {
      const startDate = formatDateFromAPI(item.start_date);
      const endDate = formatDateFromAPI(item.end_date);

      const startDateFrom = formatDateFromAPI(date.from!.toISOString());
      const endDateTo = formatDateFromAPI(date.to!.toISOString());

      return startDate >= startDateFrom && endDate <= endDateTo;
    });
  }

  return data;
}
