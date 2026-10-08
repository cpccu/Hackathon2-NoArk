import { redirect } from "next/navigation";

export default function ComplaintsIndex() {
  redirect("/complaints/new");
}
