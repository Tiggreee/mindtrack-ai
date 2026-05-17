import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  type: string;
  taskCount: number;
};

export function ProjectCard({
  id,
  name,
  description,
  status,
  type,
  taskCount,
}: ProjectCardProps) {
  return (
    <Link href={`/tasks?project=${id}`}>
      <Card className="transition-colors hover:border-muted-foreground/40">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{name}</CardTitle>
            <Badge variant="outline">{status}</Badge>
          </div>
          {description ? (
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="flex gap-2 text-xs text-muted-foreground">
          <span>{taskCount} tareas</span>
          {type === "job_hunt" ? <span>· empleo</span> : null}
        </CardContent>
      </Card>
    </Link>
  );
}
