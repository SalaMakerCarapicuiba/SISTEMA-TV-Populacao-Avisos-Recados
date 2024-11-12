"use client";

import { SideBarMenu } from "@/components/layout/SidebarMenu";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function V1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-dvw h-dvh p-4 flex flex-row items-stretch justify-stretch">
      <div
        className={`absolute h-full md:relative lg:relative z-10 lg:w-[320px] md:w-64 md:flex md:flex-col md:items-start md:justify-start ${
          isSidebarOpen ? "block" : "hidden"
        } md:block top-[-0.5px]`}
      >
        <SideBarMenu
          onClose={() => {
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <main className="w-full h-full flex-grow bg-background shadow-inner border-[2px] border-secondary rounded-lg">
        <div className="flex md:hidden z-50">
          <Button variant="ghost" className="h-12" onClick={toggleSidebar}>
            <Menu className="text-white size-6" />
          </Button>
        </div>
        {children}
      </main>

      <Toaster />
    </div>
  );
}
