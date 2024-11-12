"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserRoleEnum } from "@/core/enum/userRole";
import { responseAuthenticationSchemaType } from "@/core/models/user/authenticateResponse";

interface ProfileProps {
  profile: responseAuthenticationSchemaType | null;
  handleLogout: () => void;
}

export function Profile({ profile, handleLogout }: ProfileProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" className="p-2 flex flex-row items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmTByICqd42XV6QPsDgn6YUqxbIVCIVfV-pA&s" />
            <AvatarFallback className="bg-slate-800">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-foreground justify-start gap-2">
            <h3 className="text-sm">{profile?.full_name ?? ""}</h3>
            <span className="text-lime-400 text-xs">
              {profile?.role === UserRoleEnum.admin ? "Admnistrador" : "Editor"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-[320px] ml-8 mt-4 border-[1px]"
      >
        <div>
          <h2 className="text-xl font-bold">Perfil</h2>
          <div className="flex gap-2 items-center">
            <span>Sessão do usuário</span>
            <Badge variant={"secondary"}>ativa</Badge>
          </div>
        </div>

        <ul className="list-none my-6">
          <li>
            <div className="flex flex-row items-center gap-2">
              <strong>Nome:</strong>
              <span
                title={profile?.full_name ?? ""}
                className="text-ellipsis text-nowrap overflow-hidden"
              >
                {profile?.full_name ?? ""}
              </span>
            </div>
          </li>
          <li>
            <div className="flex flex-row items-center gap-2">
              <strong>E-mail:</strong>
              <span
                title={profile?.email ?? ""}
                className="text-ellipsis text-nowrap overflow-hidden"
              >
                {profile?.email ?? ""}
              </span>
            </div>
          </li>
        </ul>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-4"
        >
          <LogOut size={24} />
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  );
}
