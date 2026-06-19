import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-muted-foreground">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This module is currently under development. Please check back later.
      </p>
    </div>
  );
};
