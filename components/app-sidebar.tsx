"use client"

import Link from "next/link";
import * as React from "react";
import { MdBuildCircle, MdCollections, MdDashboard, MdImage, MdPages, MdShoppingCart } from "react-icons/md";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar";
import LogoSquare from "./logo-square";

// This is sample data.
const data = {
  user: {
    name: "Mandarin 3D",
    email: "ryan@mandarin3d.com",
    avatar: "https://unavatar.io/ryandavogel",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: MdDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: MdShoppingCart,
    },
    {
      title: "Collections",
      url: "/dashboard/collections",
      icon: MdCollections,
    },
    {
      title: "Pages",
      url: "/dashboard/pages",
      icon: MdPages,
    },
    {
      title: "Media Library",
      url: "/dashboard/media",
      icon: MdImage,
    },
    {
      title: "Dev Tools",
      url: "/dashboard/dev-tools",
      icon: MdBuildCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset" className="border-none">
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center">
            <LogoSquare />
            <h1 className="text-xl font-bold ml-2 truncate">Mandarin 3D</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      {/* <SidebarRail className="bg-m3d-primary" /> */}
    </Sidebar>
  )
}
