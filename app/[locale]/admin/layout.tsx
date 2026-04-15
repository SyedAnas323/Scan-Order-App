import { ReactNode } from "react";
import { notFound } from "next/navigation";

export default function DisabledLegacyAdminLayout({ children }: { children: ReactNode }) {
  void children;
  notFound();
}
