import React from "react";

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Einstellungen</h1>
        <p className="text-muted-foreground mt-2">
          Konfigurieren Sie Ihre Anwendungseinstellungen
        </p>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <p className="text-muted-foreground">
          Einstellungen werden hier angezeigt.
        </p>
      </div>
    </div>
  );
};

export default Settings;
