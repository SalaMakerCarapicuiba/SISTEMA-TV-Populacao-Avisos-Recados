import { ReactNode } from "react";
import { LayoutDashboard, Newspaper, Users } from "lucide-react";

export interface AppRoutes {
  icon: ReactNode;
  label: string;
  url: string;
  restricted: boolean;
}

const routes: AppRoutes[] = [
  {
    icon: <LayoutDashboard size={24} className="text-foreground" />,
    label: "Geral",
    url: "/v1/notices",
    restricted: false,
  },
  {
    icon: <Newspaper size={24} className="text-foreground" />,
    label: "Minhas publicações",
    url: "/v1/notices/mine",
    restricted: false,
  },
  {
    icon: <Users size={24} className="text-foreground" />,
    label: "Usuários",
    url: "/v1/users",
    restricted: true,
  },
];

export default routes;
