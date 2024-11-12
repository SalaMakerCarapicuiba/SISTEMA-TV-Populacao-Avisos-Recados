"use client";

import LoginBanner from "@/assets/login_banner.png";
import LogoPng from "@/assets/logo.png";
import Image from "next/image";

import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Titillium_Web } from "next/font/google";
import { LoginForm } from "./form";

const titilliumWeb = Titillium_Web({ subsets: ["latin"], weight: "600" });

export default function LoginPage() {
  return (
    <div className="w-dvw h-dvh flex flex-row items-stretch justify-stretch bg-background">
      <main className="bg-background relative z-10 w-full h-full p-6 md:p-8 xl:p-12 ">
        <div className="w-full h-[90%] max-w-[500px] mx-auto">
          <div className="w-full flex flex-row items-center gap-8 justify-between">
            <Image
              src={LogoPng}
              alt="logo"
              width={120}
              height={120}
              className="overflow-hidden rounded-2xl hover:scale-105 transition-all shadow-lg"
            />
            <ThemeSwitch />
          </div>

          <div className="pt-10 w-full h-full flex flex-col items-stretch justify-center gap-10">
            <div className="flex flex-col items-start gap-4">
              <h2 className="lg:pt-0 text-4xl font-bold  ">
                Acesse a plataforma
              </h2>
              <p className="font-normal text-sm  ">
                Autentique-se para começar a criar novos avisos
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </main>
      <div className="w-full h-[220px] xl:h-full absolute overflow-hidden z-0 xl:relative ">
        <Image
          src={LoginBanner}
          alt="Login Banner"
          className="w-full h-full object-cover opacity-85"
        />
      </div>
      <Toaster />
    </div>
  );
}
