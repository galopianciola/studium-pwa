"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Student } from "@/lib/teacher-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.original.progress
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-24 h-2" />
          <span>{progress}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "accuracy",
    header: "Accuracy",
    cell: ({ row }) => `${row.original.accuracy}%`,
  },
  {
    accessorKey: "studyStreak",
    header: "Streak",
    cell: ({ row }) => `${row.original.studyStreak} days`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === "on-track" ? "secondary" : status === "at-risk" ? "destructive" : "default"
      return (
        <Badge
          variant={variant}
          className={status === "needs-attention" ? "bg-teacher-warning text-teacher-warning-foreground" : ""}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-teacher-danger focus:text-teacher-danger">
              Archive Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
