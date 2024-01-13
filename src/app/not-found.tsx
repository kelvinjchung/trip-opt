import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error 404 (Not Found)!",
};

export default function NotFound() {
  return (
    <main className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <div className="text-xl">
        <b>404.</b> <span className="text-slate-600">Not Found.</span>
      </div>
      <div className="text-sm text-muted-foreground">
        <Link href="/plan">
          <ins>Return to Plan Page</ins>
        </Link>
      </div>
    </main>
  );
}
