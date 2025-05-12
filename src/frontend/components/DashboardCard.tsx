import type React from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  isLoading = false,
}) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          )}
          {isLoading ? (
            <div className="h-4 w-24 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 bg-muted rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
