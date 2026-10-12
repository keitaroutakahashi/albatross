import { ErrorScreen } from "@/app/_components/ui/error-screen";
import { PublicShell } from "@/app/_components/ui/public-shell";

export default function NotFound() {
  return (
    <PublicShell>
      <ErrorScreen title="Not Found" />
    </PublicShell>
  );
}
