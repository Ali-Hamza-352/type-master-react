import { Book, Activity, Settings, Info, Gamepad, BarChart2, Mail } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Studying", icon: Book, path: "/studying" },
  { title: "Typing Meter", icon: Activity, path: "/typing-meter" },
  { title: "Custom Review", icon: Activity, path: "/custom-review" },
  { title: "Typing Test", icon: Activity, path: "/typing-test" },
  { title: "Games", icon: Gamepad, path: "/games" },
  { title: "Statistics", icon: BarChart2, path: "/statistics" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "About", icon: Info, path: "/about" },
  { title: "Contact Us", icon: Mail, path: "/contact" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="mb-4 p-4">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span className="text-3xl">T</span>
            TypingMaster
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location.pathname === item.path ? "bg-blue-50" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
