"use client";

import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      label: "Notes",
      href: "/notes",
      isActive: pathname.startsWith("/notes")
    }
  ];

  return (
    <nav className="border-border bg-background/80 sticky top-0 z-50 flex flex-row items-center justify-between border-b px-6 py-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-row items-center gap-8">
        <Link
          href="/"
          className="focus-visible:ring-ring flex items-center gap-2 rounded-lg p-1 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
        >
          <NotepadText className="text-primary text-3xl" />
          <span className="text-foreground hidden text-xl font-bold sm:block">
            Note Taking App
          </span>
        </Link>
        <ul className="flex flex-row items-center gap-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  item.isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
                {item.isActive && (
                  <div className="bg-primary absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
