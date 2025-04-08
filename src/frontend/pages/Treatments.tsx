import type React from "react";

const Treatments: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Behandlungen</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie die Behandlungen und Termine
        </p>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <p className="text-muted-foreground">
          Behandlungsliste wird hier angezeigt.
        </p>
      </div>
    </div>
  );
};

export default Treatments;
