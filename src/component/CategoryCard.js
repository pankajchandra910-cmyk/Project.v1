import { Card, CardContent } from "./Card";
import { LucideIcon } from "lucide-react";



export default function CategoryCard({ icon: Icon, title, description, onClick }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center space-y-3">
        <div className="flex justify-center">
          <Icon className="w-12 h-12 text-primary group-hover:text-secondary transition-colors" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}