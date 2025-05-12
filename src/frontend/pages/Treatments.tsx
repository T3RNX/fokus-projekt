import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { getImageUrl } from "../API/Dog";
import { getAllTreatments } from "../API/Treatment";
import { parseLocalDate, formatTime } from "@/lib/date-utils";

interface Treatment {
  treatmentID: number;
  dogID: number;
  description: string;
  date: string;
  time: string;
  cost: number;
  dogName?: string;
}

export default function BehandlungenPage() {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setIsLoading(true);

        const data = await getAllTreatments();

        const treatmentsWithDogNames = await Promise.all(
          data.map(async (treatment: Treatment) => {
            try {
              const dogResponse = await fetch(
                `https://localhost:7202/Dog/${treatment.dogID}`
              );
              if (dogResponse.ok) {
                const dogData = await dogResponse.json();
                return {
                  ...treatment,
                  dogName: dogData.name,
                };
              }
              return treatment;
            } catch (err) {
              console.error(
                `Error fetching dog name for ID ${treatment.dogID}:`,
                err
              );
              return treatment;
            }
          })
        );

        setTreatments(treatmentsWithDogNames);
      } catch (err) {
        console.error("Error fetching treatments:", err);
        setError(
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const handleTreatmentClick = (treatmentID: number) => {
    navigate(`/treatments/${treatmentID}`);
  };

  const filteredTreatments = treatments.filter((treatment) => {
    const lower = searchTerm.toLowerCase();
    return (
      treatment.description?.toLowerCase().includes(lower) ||
      treatment.date?.toLowerCase().includes(lower) ||
      treatment.time?.toLowerCase().includes(lower) ||
      (treatment.dogName && treatment.dogName.toLowerCase().includes(lower))
    );
  });

  return (
    <div>
      <div className="mb-6 relative">
        <h1 className="text-3xl font-bold text-foreground">Behandlungen</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie alle Behandlungen für Hunde
        </p>
        <div className="absolute right-0 top-0">
          <Button
            onClick={() => navigate("/treatments/create")}
            className="bg-[#ff6c3e] hover:bg-[#ff6c3e]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neue Behandlung
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Suchen nach Beschreibung, Datum oder Hund..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6c3e]"></div>
        </div>
      ) : filteredTreatments.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground">
            Keine Behandlungen gefunden
          </p>
          <Button
            onClick={() => navigate("/treatments/create")}
            className="mt-4 bg-[#ff6c3e] hover:bg-[#ff6c3e]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neue Behandlung erstellen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <Card
              key={treatment.treatmentID}
              className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-border hover:border-[#ff6c3e]"
              onClick={() => handleTreatmentClick(treatment.treatmentID)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Behandlung{" "}
                      <span className="text-sm text-muted-foreground">
                        #{treatment.treatmentID}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {parseLocalDate(treatment.date).toLocaleDateString(
                        "de-DE"
                      )}
                      , {formatTime(treatment.time)}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-[#ff6c3e]">
                    {treatment.cost.toFixed(2)} CHF
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={getImageUrl(treatment.dogID) || "/placeholder.svg"}
                      alt="Hund"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {treatment.dogName || `Hund #${treatment.dogID}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {treatment.dogID}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{treatment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
