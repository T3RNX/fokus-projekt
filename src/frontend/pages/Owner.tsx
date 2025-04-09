import React from "react";

const Owner: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Besitzer</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie die Besitzer und deren Informationen
        </p>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <p className="text-muted-foreground">
          Besitzerliste wird hier angezeigt.
        </p>
      </div>
    </div>
  );
};

export default Owner;
