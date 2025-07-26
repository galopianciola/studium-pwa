"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  "Study Time (hours)": {
    label: "Study Time (hours)",
    color: "hsl(var(--teacher-primary))",
  },
  "Completion Rate": {
    label: "Completion Rate",
    color: "hsl(var(--teacher-secondary))",
  },
  "Class Average": {
    label: "Class Average",
    color: "hsl(var(--teacher-primary))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--teacher-primary))",
  },
  multipleChoice: { label: "Multiple Choice", color: "#8884d8" },
  trueFalse: { label: "True/False", color: "#82ca9d" },
  flashcards: { label: "Flashcards", color: "#ffc658" },
  summary: { label: "Summary", color: "#ff8042" },
} satisfies ChartConfig

export function WeeklyProgressChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-teacher-card border-teacher-border">
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Study time and completion rate over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="left" stroke="var(--color-study-time)" />
            <YAxis yAxisId="right" orientation="right" stroke="var(--color-completion-rate)" />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Study Time (hours)"
              stroke="var(--color-Study Time (hours))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Completion Rate"
              stroke="var(--color-Completion Rate)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function AccuracyTrendsChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-teacher-card border-teacher-border">
      <CardHeader>
        <CardTitle>Class Accuracy Trends</CardTitle>
        <CardDescription>Monthly average accuracy rate for the whole class.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[60, 100]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="Class Average" stroke="var(--color-Class Average)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ActivityTypeDistributionChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-teacher-card border-teacher-border flex flex-col">
      <CardHeader>
        <CardTitle>Activity Type Preferences</CardTitle>
        <CardDescription>Distribution of completed activity types.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[300px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function StudyTimeDistributionChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-teacher-card border-teacher-border">
      <CardHeader>
        <CardTitle>Peak Study Hours</CardTitle>
        <CardDescription>Number of students active during different times of the day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="students" fill="var(--color-students)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
