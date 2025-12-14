import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const firstLetter = user?.name?.[0]?.toUpperCase() ?? "U";
  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="h-14 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-semibold text-sm">TaskFlow</span>

        <Avatar className="h-8 w-8">
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
