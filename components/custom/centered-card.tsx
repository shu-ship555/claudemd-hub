import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CenteredCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function CenteredCard({ title, description, children, footer, className, cardClassName, headerClassName, contentClassName }: CenteredCardProps) {
  return (
    <main className={cn("flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4", className)}>
      <Card className={cn("w-full max-w-md", cardClassName)}>
        <CardHeader className={headerClassName}>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className={contentClassName}>
          {children}
          {footer}
        </CardContent>
      </Card>
    </main>
  );
}
