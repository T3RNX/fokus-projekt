"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getImageUrl } from "../API/Dog";
import { getAllDogs, type Dog } from "../API/Dog";
import {
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
} from "../API/Treatment";
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

export default function TreatmentDetailsPage() {
  const { treatmentID } = useParams<{ treatmentID: string }>();
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    time: "",
    cost: 0,
    dogID: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [dogName, setDogName] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!treatmentID) {
          throw new Error("Keine Behandlungs-ID angegeben");
        }

        // Fetch treatment data
        const data = await getTreatmentById(Number(treatmentID));
        setTreatment(data);

        setFormData({
          description: data.description || "",
          date: data.date,
          time: data.time.substring(0, 5), // HH:MM format for input
          cost: data.cost,
          dogID: data.dogID,
        });

        // Fetch dog data to get the name
        try {
          const dogRes = await fetch(
            `https://localhost:7202/Dog/${data.dogID}`
          );
          if (dogRes.ok) {
            const dogData = await dogRes.json();
            setDogName(dogData.name);
          }
        } catch (dogErr) {
          console.error("Error fetching dog name:", dogErr);
        }

        // Fetch dogs for dropdown if we need to change the dog
        const dogsData = await getAllDogs();
        setDogs(dogsData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [treatmentID]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "time") {
      // Append seconds to the time value
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

  const handleSave = async () => {
    if (!treatment) return;

    try {
      setError(null);
      const updatedTreatment = {
        ...treatment,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        cost: formData.cost,
        dogID: formData.dogID,
      };

      await updateTreatment(updatedTreatment);

      // Update dog name if dog changed
      if (treatment.dogID !== formData.dogID) {
        const selectedDog = dogs.find((dog) => dog.dogID === formData.dogID);
        setDogName(selectedDog?.name || null);
      }

      setTreatment(updatedTreatment);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(
        err instanceof Error ? err.message : "Ein Fehler beim Speichern"
      );
    }
  };

  const handleDelete = async () => {
    if (!treatment || !treatmentID) return;

    try {
      await deleteTreatment(Number(treatmentID));
      navigate("/treatments");
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Ein Fehler beim Löschen");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        Lade Behandlung...
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="flex items-center justify-center py-12 text-center text-red-500">
        Behandlung nicht gefunden
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Behandlung #{treatment.treatmentID}
            </h1>
            <p className="text-muted-foreground mt-1">
              {dogName || `Hund #${treatment.dogID}`} •{" "}
              {parseLocalDate(treatment.date).toLocaleDateString("de-DE")} •{" "}
              {formatTime(treatment.time)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-lg cursor-pointer sm:items-center flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Löschen
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-card rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-card-foreground p-1 rounded-full hover:bg-accent cursor-pointer"
          >
            <Pencil size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Hund
            </label>
            {isEditing ? (
              <select
                name="dogID"
                value={formData.dogID}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 bg-muted/70 text-card-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[#ff6c3e]"
              >
                {dogs.map((dog) => (
                  <option key={dog.dogID} value={dog.dogID}>
                    {dog.name} ({dog.race})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3 bg-muted/70 p-3 rounded-md border border-border">
                <img
                  src={getImageUrl(treatment.dogID) || "/placeholder.svg"}
                  alt="Hund"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/40";
                  }}
                />
                <span>{dogName || `Hund #${treatment.dogID}`}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Datum
            </label>
            {isEditing ? (
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-muted/70 border-border h-10"
              />
            ) : (
              <div className="bg-muted/70 p-3 rounded-md border border-border">
                {parseLocalDate(treatment.date).toLocaleDateString("de-DE")}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Uhrzeit
            </label>
            {isEditing ? (
              <Input
                type="time"
                name="time"
                value={formData.time.substring(0, 5)}
                onChange={handleChange}
                className="bg-muted/70 border-border h-10"
              />
            ) : (
              <div className="bg-muted/70 p-3 rounded-md border border-border">
                {formatTime(treatment.time)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Kosten (CHF)
            </label>
            {isEditing ? (
              <Input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="bg-muted/70 border-border h-10"
              />
            ) : (
              <div className="bg-muted/70 p-3 rounded-md border border-border font-medium">
                {treatment.cost.toFixed(2)} CHF
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-muted-foreground mb-1">
              Beschreibung
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-muted/70 p-3 rounded-md border border-border min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6c3e]"
              />
            ) : (
              <div className="bg-muted/70 p-3 rounded-md border border-border min-h-[80px]">
                {treatment.description || "Keine Beschreibung vorhanden."}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#ff6c3e] hover:bg-[#ff6c3e]/90 text-white"
            >
              Speichern
            </Button>
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Behandlung löschen
            </h3>
            <p className="text-muted-foreground mb-6">
              Möchtest du diese Behandlung wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg cursor-pointer"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
