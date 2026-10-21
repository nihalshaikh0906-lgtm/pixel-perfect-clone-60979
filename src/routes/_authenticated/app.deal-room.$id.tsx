import { createFileRoute } from "@tanstack/react-router";
import { DealRoomView } from "../deal-room.$id";

export const Route = createFileRoute("/_authenticated/app/deal-room/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Deal Room · DealOS Workspace" },
      { name: "description", content: "Client-facing Live Deal Room preview and presentation builder." },
    ],
  }),
  component: InAppDealRoomPage,
});

function InAppDealRoomPage() {
  const { id } = Route.useParams();
  return <DealRoomView leadId={id} />;
}
