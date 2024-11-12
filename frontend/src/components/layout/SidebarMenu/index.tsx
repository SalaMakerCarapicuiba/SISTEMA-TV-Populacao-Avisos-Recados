"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { CreateNoticeForm } from "../NoticeForm/create";
import { Profile } from "./profile";

import { CreateUserForm } from "@/app/v1/(v1)/users/forms/create";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";
import routes, { AppRoutes } from "@/routes";
import { getUserProfile } from "@/util/profile";
import { X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SideBarMenuProps {
  onClose: () => void;
}

export function SideBarMenu({ onClose }: SideBarMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [avaiableRoutes, setAvaiableRoutes] = useState<AppRoutes[]>([]);
  const [profile, setProfile] =
    useState<responseAuthenticationSchemaType | null>(null);

  const handleLogout = useCallback(() => {
    router.replace("/v1/logout");
  }, [router]);

  useEffect(() => {
    const user = getUserProfile();
    if (!user) {
      handleLogout();
    } else {
      setProfile(user);
    }
  }, [handleLogout]);

  useEffect(() => {
    setAvaiableRoutes(
      routes.filter((route) => {
        if (route.restricted) {
          return profile?.role === UserRoleEnum.admin;
        }
        return true;
      }),
    );
  }, [router, profile]);

  return (
    <div className="bg-background relative w-[320px] h-full pr-4 py-4 flex flex-col justify-between items-start">
      <div className="w-full space-y-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="size-6" />
        </Button>

        <div className="w-full space-y-8">
          <div className="flex flex-row items-center gap-4">
            <Profile profile={profile} handleLogout={handleLogout} />
            <ThemeSwitch />
          </div>
          <nav className="flex flex-col items-stretch justify-start gap-2">
            {/* Menu Items */}
            {avaiableRoutes.map((route) => {
              return (
                <Button
                  key={route.url}
                  variant="icon"
                  className={cn(
                    `min-w-16 p-4 h-auto flex flex-row gap-4 justify-start rounded-lg  text-foreground hover:bg-secondary`,
                    pathname === route.url && "bg-secondary",
                  )}
                  asChild
                >
                  <Link href={route.url}>
                    {route.icon}
                    <span>{route.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
      {pathname.includes("users") ? <CreateUserForm /> : <CreateNoticeForm />}
    </div>
  );
}
