import { Module } from '@/types/home';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold leading-none tracking-tight">{module.title}</h3>
          <Badge variant="secondary" className="shrink-0" aria-label={`Module number ${module.order}`}>
            Module {module.order}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {module.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
