import { responseNoticeSchemaType } from "@/core/models/notice/responseNoticeSchema";

export function filterSearchBar(
  data: responseNoticeSchemaType[],
  searchBarValue: string,
) {
  return (data ?? []).filter((item) => {
    const { content, category, subcategory, subject, local, user_name } = item;

    const lowercaseContent = content?.toLowerCase();
    const lowercaseCategory = category?.toLowerCase();
    const lowercaseSubCategory = subcategory?.toLowerCase();
    const lowercaseSubject = subject?.toLowerCase();
    const lowercaseLocal = local?.toLowerCase();
    const lowercaseUserName = user_name?.toLowerCase();

    return (
      lowercaseContent?.includes(searchBarValue.toLowerCase()) ||
      lowercaseCategory?.includes(searchBarValue.toLowerCase()) ||
      lowercaseSubCategory?.includes(searchBarValue.toLowerCase()) ||
      lowercaseSubject?.includes(searchBarValue.toLowerCase()) ||
      lowercaseLocal?.includes(searchBarValue.toLowerCase()) ||
      lowercaseUserName?.includes(searchBarValue.toLowerCase())
    );
  });
}
