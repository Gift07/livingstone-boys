import { Suspense } from "react";
import {
  ClassmateResults,
  PublicChrome,
  SearchFallback,
} from "@/components/public/PublicHome";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <PublicChrome>
      <Suspense fallback={<SearchFallback />}>
        <ClassmateResults searchParams={searchParams} />
      </Suspense>
    </PublicChrome>
  );
}
