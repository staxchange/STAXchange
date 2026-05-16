import { TechnicianNotesForm } from "../../../../components/TechnicianNotesForm";

export default async function NotesPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  return <><h1>Visit Notes</h1><TechnicianNotesForm workOrderId={workOrderId} /></>;
}
