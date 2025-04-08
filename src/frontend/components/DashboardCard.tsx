import type React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="bg-card rounded-lg p-4 flex flex-col border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-card-foreground font-medium">{title}</h3>
        {icon && <div className="flex-shrink-0">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-4xl font-bold text-card-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
