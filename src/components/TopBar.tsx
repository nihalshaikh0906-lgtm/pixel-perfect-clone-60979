import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function TopBar({
  back,
  title,
  subtitle,
  right,
}: {
  back?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-6 py-4">
        {back ? (
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Command Hub
            </Link>
          </Button>
        ) : (
          <span className="eyebrow rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary">
            Deal OS · Command Hub
          </span>
        )}
        <div className="min-w-0 flex-1">
          {title ? <div className="truncate text-lg font-semibold">{title}</div> : null}
          {subtitle ? <div className="eyebrow truncate">{subtitle}</div> : null}
        </div>
        {right}
        <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </header>
  );
}
