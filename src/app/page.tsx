import type { Metadata } from "next";
import ClientPage from "@/app/ClientPage";

export const metadata: Metadata = {
  title: "Brankas Rahasia | Secret Love Archive",
  description: "Arsip digital cinta rahasia",
};

export default function Page() {
  return <ClientPage />;
}
