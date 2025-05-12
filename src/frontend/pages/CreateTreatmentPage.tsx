import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { getAllDogs, type Dog } from "../API/Dog";
import { createTreatment } from "../API/Treatment";
import { getCurrentDateString, getCurrentTimeString } from "@/lib/date-utils";

interface FormData {
  dogID: number;
  description: string;
  date: string;
  time: string;
  cost: number;
}

export default function CreateTreatmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const preselectedDogID = queryParams.get("dogID")
    ? Number(queryParams.get("dogID"))
    : 0;

  const [formData, setFormData] = useState<FormData>({
    dogID: preselectedDogID,
    description: "",
    date: getCurrentDateString(),
    time: getCurrentTimeString().substring(0, 5),
    cost: 0,
  });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const dogsData = await getAllDogs();
        if (Array.isArray(dogsData)) {
          setDogs(dogsData);
          if (preselectedDogID === 0 && dogsData.length > 0) {
            setFormData((prev) => ({
              ...prev,
              dogID: dogsData[0].dogID,
            }));
          }
        } else {
          setError("Unerwartetes Datenformat bei der Abfrage der Hunde");
        }
      } catch (err) {
        console.error("Fehler beim Abrufen der Hunde:", err);
        setError("Fehler beim Laden der Hunde");
      }
    };

    fetchDogs();
  }, [preselectedDogID]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "time") {
      setFormData({
        ...formData,
        [name]: value + ":00",
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "cost" || name === "dogID"
            ? Number.parseFloat(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dogID || !formData.date || !formData.time) {
      setError("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createTreatment({
        dogID: formData.dogID,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        cost: formData.cost,
      });

      if (preselectedDogID) {
        navigate(`/dogs/${preselectedDogID}?tab=treatments`);
      } else {
        navigate("/treatments");
      }
    } catch (err) {
      console.error("Error creating treatment:", err);
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (preselectedDogID) {
      navigate(`/dogs/${preselectedDogID}?tab=treatments`);
    } else {
      navigate("/treatments");
    }
  };

  return (
    <div>
      <div className="mb-6 relative">
        <h1 className="text-3xl font-bold text-foreground">Neue Behandlung</h1>
        <p className="text-muted-foreground mt-2">
          Fügen Sie eine neue Behandlung zur Datenbank hinzu. Die Behandlungs-ID
          wird automatisch generiert.
        </p>
        <div className="absolute right-0 top-0">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Zurück
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Behandlungsinformationen
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-1">
                <label
                  htmlFor="dogID"
                  className="block text-sm font-medium text-card-foreground mb-1"
                >
                  Hund <span className="text-red-500">*</span>
                </label>
                <select
                  id="dogID"
                  name="dogID"
                  value={formData.dogID}
                  onChange={handleChange}
                  className="w-full h-10 px-3 py-2 border border-input bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e]"
                >
                  <option value="">Hund auswählen</option>
                  {dogs.map((dog) => (
                    <option key={dog.dogID} value={dog.dogID}>
                      {dog.name} ({dog.race || "Keine Rasse"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-card-foreground mb-1"
                >
                  Datum <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-card-foreground mb-1"
                >
                  Uhrzeit <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time.substring(0, 5)}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="cost"
                  className="block text-sm font-medium text-card-foreground mb-1"
                >
                  Kosten (CHF) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="h-10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-card-foreground mb-1"
                >
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input resize-none"
                  placeholder="Detaillierte Beschreibung der Behandlung"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={handleBack}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ff6c3e] hover:bg-[#ff6c3e]/90 text-white"
              >
                {isSubmitting ? "Wird gespeichert..." : "Behandlung speichern"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
