import AssistantClient from "./AssistantClient";
import { getDict, type Locale } from "@/i18n/dictionaries";

export default function AssistantPage({ params }: { params: { locale: Locale } }) {
  return <AssistantClient locale={params.locale} d={getDict(params.locale)} />;
}
