import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";

interface TimeRange {
  start_time?: string;
  end_time?: string;
}

export function filterTime(
  data: responseNoticeSchemaType[],
  times: TimeRange | undefined,
) {
  if (times?.start_time || times?.end_time) {
    return data.filter((item) => {
      const itemStartTime = new Date(
        `1970-01-01T${item.start_time}Z`,
      ).getTime();
      const itemEndTime = new Date(`1970-01-01T${item.end_time}Z`).getTime();

      const startTime = times.start_time
        ? new Date(`1970-01-01T${times.start_time}Z`).getTime()
        : null;
      const endTime = times.end_time
        ? new Date(`1970-01-01T${times.end_time}Z`).getTime()
        : null;

      if (startTime !== null && endTime !== null) {
        return itemStartTime >= startTime && itemEndTime <= endTime;
      } else if (startTime !== null) {
        return itemStartTime >= startTime;
      } else if (endTime !== null) {
        return itemEndTime <= endTime;
      }

      return true;
    });
  }

  return data;
}
