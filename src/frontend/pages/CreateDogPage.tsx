"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDog } from "../API/Dog";
import { getAllOwners } from "../API/Owner";
import { Plus, ArrowLeft, Upload, X, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";

interface Owner {
  ownerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const CreateDogPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoadingOwners(true);
        const ownersData = await getAllOwners();
        setOwners(ownersData);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError("Fehler beim Laden der Besitzer");
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOwnerSelect = (owner: Owner) => {
    setFormData((prev) => ({ ...prev, ownerID: owner.ownerID.toString() }));
    setShowDropdown(false);
  };

  const getSelectedOwner = () => {
    return owners.find(
      (owner) => owner.ownerID.toString() === formData.ownerID
    );
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

  const handleBack = () => {
    navigate(-1);
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
      navigate(-1);
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
              Neuen Hund erstellen
            </h1>
            <p className="text-muted-foreground mt-1">
              Fügen Sie einen neuen Hund zur Datenbank hinzu
            </p>
          </div>
        </div>
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
              <label className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 mb-4 h-64 lg:h-auto lg:aspect-square cursor-pointer hover:border-[#ff6c3e] transition-colors">
                <Upload size={48} className="text-muted-foreground mb-3" />
                <p className="text-center text-muted-foreground mb-2">
                  Ziehen Sie ein Bild hierher oder klicken Sie, um ein Bild
                  auszuwählen
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG oder GIF, max. 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
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
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Besitzer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-4 py-2 bg-muted text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] border cursor-pointer border-input text-left flex items-center justify-between"
                    >
                      {loadingOwners
                        ? "Besitzer werden geladen..."
                        : getSelectedOwner()
                        ? `${getSelectedOwner()?.firstName} ${
                            getSelectedOwner()?.lastName
                          }`
                        : "Besitzer auswählen"}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showDropdown && !loadingOwners && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {owners.length === 0 ? (
                          <div className="px-4 py-2 text-muted-foreground">
                            Keine Besitzer gefunden
                          </div>
                        ) : (
                          owners.map((owner) => (
                            <button
                              key={owner.ownerID}
                              type="button"
                              onClick={() => handleOwnerSelect(owner)}
                              className="w-full cursor-pointer px-4 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none"
                            >
                              <div className="font-medium">
                                {owner.firstName} {owner.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {owner.email}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
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
