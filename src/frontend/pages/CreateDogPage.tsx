"use client";

import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDog } from "../API/Dog";
import { Plus, ArrowLeft, Upload, X } from "lucide-react";

const CreateDogPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Bild darf nicht größer als 5MB sein");
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const validateForm = () => {
    const requiredFields = ["name", "age", "race", "weight", "ownerID"];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (emptyFields.length > 0) {
      setError(
        `Bitte füllen Sie alle Pflichtfelder aus: ${emptyFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const submitData = new FormData();
      submitData.append("Name", formData.name);
      submitData.append("Age", formData.age);
      submitData.append("Race", formData.race);
      submitData.append("Weight", formData.weight);
      submitData.append("OwnerID", formData.ownerID);

      if (selectedImage) {
        submitData.append("Image", selectedImage);
      }

      await createDog(submitData);
      navigate("/dogs");
    } catch (err) {
      console.error("Error creating dog:", err);
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Neuen Hund erstellen
          </h1>
          <p className="text-muted-foreground mt-1">
            Fügen Sie einen neuen Hund zur Datenbank hinzu
          </p>
        </div>
        <button
          onClick={() => navigate("/dogs")}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Zurück
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Bild
            </h2>

            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden aspect-square mb-4">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Vorschau"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 cursor-pointer"
                  aria-label="Bild entfernen"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 mb-4 aspect-square">
                <Upload size={48} className="text-muted-foreground mb-3" />
                <p className="text-center text-muted-foreground mb-2">
                  Ziehen Sie ein Bild hierher oder klicken Sie, um ein Bild
                  auszuwählen
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG oder GIF, max. 5MB
                </p>
              </div>
            )}

            <label className="w-full bg-[#ff6c3e] hover:bg-[#e55c2e] text-white py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors">
              <Upload size={18} />
              Bild hochladen
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Informationen
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-card-foreground mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input"
                    placeholder="Name des Hundes"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-card-foreground mb-1"
                  >
                    Alter <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input"
                    placeholder="Alter in Jahren"
                    min="0"
                  />
                </div>

                <div>
                  <label
                    htmlFor="race"
                    className="block text-sm font-medium text-card-foreground mb-1"
                  >
                    Rasse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="race"
                    name="race"
                    value={formData.race}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input"
                    placeholder="Rasse des Hundes"
                  />
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-card-foreground mb-1"
                  >
                    Gewicht (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input"
                    placeholder="Gewicht in kg"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="ownerID"
                    className="block text-sm font-medium text-card-foreground mb-1"
                  >
                    Besitzer ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ownerID"
                    name="ownerID"
                    value={formData.ownerID}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border border-input"
                    placeholder="ID des Besitzers"
                    min="1"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
                    isSubmitting
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-[#ff6c3e] hover:bg-[#e55c2e] cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Wird erstellt...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Hund erstellen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDogPage;
