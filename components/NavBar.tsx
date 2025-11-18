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
      isActive: pathname === "/notes"
    }
  ];

  return (
    <nav className="flex flex-row items-center gap-8 border-b p-4">
      <Link href="/">
        <NotepadText className="text-2xl" />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "transition-colors hover:text-gray-800",
                item.isActive ? "text-gray-900" : "text-gray-500"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
