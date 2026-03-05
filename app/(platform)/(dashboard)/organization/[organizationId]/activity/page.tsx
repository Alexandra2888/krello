import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { Suspense } from "react";
import { ActivityList } from "./_components/activity-list";

export const maxDuration = 60;

interface ActivityPageProps {
  params: {
    organizationId: string;
  };
}

const ActivityPage = ({ params }: ActivityPageProps) => {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList orgId={params.organizationId} />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
