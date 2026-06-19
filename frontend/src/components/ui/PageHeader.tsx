import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  onAdd?: () => void;
  addLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, onAdd, addLabel }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {onAdd && addLabel && (
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
};
