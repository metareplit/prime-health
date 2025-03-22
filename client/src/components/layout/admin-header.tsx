import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-8">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.fullName || user?.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
