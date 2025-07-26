import { BookOpen, FileText, BrainCircuit } from "lucide-react"
import { teacherData } from "@/lib/teacher-data"
import { documentColumns } from "@/components/teacher/columns"
import { DataTable } from "@/components/teacher/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { documents } from "@/lib/teacher-data"

export default function DocumentsPage() {
  const { summary } = teacherData.documents

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Documents</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pdfs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.images}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Activities</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgActivities}</div>
          </CardContent>
        </Card>
      </div>
      <DataTable columns={documentColumns} data={documents} />
    </div>
  )
}
