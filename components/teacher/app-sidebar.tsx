"use client"

import * as React from "react"
import {
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  Trophy,
  Settings,
  LogOut,
  ChevronDown,
  GraduationCap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Prof. María González",
    email: "maria.gonzalez@universidad.edu",
    avatar: "/avatars/teacher.jpg",
  },
  courses: [
    {
      name: "Derecho Penal I",
      students: 32,
      alerts: 3,
    },
    {
      name: "Derecho Civil II",
      students: 28,
      alerts: 1,
    },
  ],
  navMain: [
    {
      title: "Panel Principal",
      url: "/teacher/dashboard",
      icon: BarChart3,
    },
    {
      title: "Cursos",
      url: "/teacher/courses",
      icon: BookOpen,
    },
    {
      title: "Estudiantes",
      url: "/teacher/students",
      icon: Users,
    },
    {
      title: "Analíticas",
      url: "/teacher/analytics",
      icon: BarChart3,
    },
    {
      title: "Intervenciones",
      url: "/teacher/interventions",
      icon: MessageSquare,
      badge: "2",
    },
    {
      title: "Gamificación",
      url: "/teacher/gamification",
      icon: Trophy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedCourse, setSelectedCourse] = React.useState(data.courses[0])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                    <GraduationCap className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{selectedCourse.name}</span>
                    <span className="truncate text-xs">{selectedCourse.students} estudiantes</span>
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {data.courses.map((course, index) => (
                  <DropdownMenuItem key={course.name} onClick={() => setSelectedCourse(course)} className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-sm border bg-blue-50">
                      <BookOpen className="size-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-xs text-muted-foreground">{course.students} estudiantes</span>
                    </div>
                    {course.alerts > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {course.alerts}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Crear nuevo curso</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">MG</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <Settings className="size-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
