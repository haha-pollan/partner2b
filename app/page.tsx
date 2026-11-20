import { redirect } from "next/navigation";

// The home page design is not built yet. Send visitors to the directory.
export default function Home() {
  redirect("/directory");
}
