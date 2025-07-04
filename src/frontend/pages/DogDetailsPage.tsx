import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DogIcon,
  Pencil,
  Plus,
  ArrowLeft,
  Trash2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  type Dog as DogType,
  getDogById,
  deleteDog,
  getImageUrl,
} from "../API/Dog";
import { getAllTreatments } from "../API/Treatment";
import { parseLocalDate, formatTime } from "../../frontend/src/lib/date-utils";
import { Button } from "../components/ui/Button";
import { getOwnerById, getAllOwners } from "../API/Owner";

interface Treatment {
  treatmentID: number;
  dogID: number;
  description: string;
  date: string;
  time: string;
  cost: number;
  dogName?: string;
}

interface EditableDogFields {
  name: string;
  age: string;
  race: string;
  weight: string;
  ownerID: string;
}

interface Owner {
  ownerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const DogDetail = () => {
  const { dogID } = useParams<{ dogID: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dog, setDog] = useState<DogType | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [description, setDescription] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [editableFields, setEditableFields] = useState<EditableDogFields>({
    name: "",
    age: "",
    race: "",
    weight: "",
    ownerID: "",
  });

  useEffect(() => {
    const fetchDog = async () => {
      if (!dogID) return;

      try {
        setLoading(true);
        const fetchedDog = await getDogById(Number.parseInt(dogID, 10));
        setDog(fetchedDog);
        setEditableFields({
          name: fetchedDog.name || "",
          age: fetchedDog.age?.toString() || "",
          race: fetchedDog.race || "",
          weight: fetchedDog.weight?.toString() || "",
          ownerID: fetchedDog.ownerID?.toString() || "",
        });
        setDescription(fetchedDog.description || "");

        // Fetch owner data
        if (fetchedDog.ownerID) {
          try {
            const ownerData = await getOwnerById(fetchedDog.ownerID);
            setOwner(ownerData);
          } catch (ownerErr) {
            console.error("Error fetching owner:", ownerErr);
          }
        }

        // Fetch all owners for dropdown
        try {
          const ownersData = await getAllOwners();
          setOwners(ownersData);
        } catch (ownersErr) {
          console.error("Error fetching owners:", ownersErr);
        }
      } catch (err) {
        console.error("Error fetching dog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [dogID]);

  useEffect(() => {
    const fetchTreatments = async () => {
      if (!dogID) return;

      try {
        setTreatmentsLoading(true);
        const allTreatments = await getAllTreatments();

        const dogTreatments = allTreatments.filter(
          (treatment: Treatment) =>
            treatment.dogID === Number.parseInt(dogID, 10)
        );

        dogTreatments.sort((a: Treatment, b: Treatment) => {
          const dateComparison =
            new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateComparison !== 0) return dateComparison;

          return b.time.localeCompare(a.time);
        });

        setTreatments(dogTreatments);
      } catch (err) {
        console.error("Error fetching treatments:", err);
      } finally {
        setTreatmentsLoading(false);
      }
    };

    if (activeTab === "treatments") {
      fetchTreatments();
    }
  }, [dogID, activeTab]);

  const handleSaveDescription = async () => {
    if (!dogID) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDog((prev) => (prev ? { ...prev, description } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOwnerSelect = (selectedOwner: Owner) => {
    setEditableFields((prev) => ({
      ...prev,
      ownerID: selectedOwner.ownerID.toString(),
    }));
    setShowOwnerDropdown(false);
  };

  const getSelectedOwner = () => {
    return owners.find(owner => owner.ownerID.toString() === editableFields.ownerID);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveDetails = async () => {
    if (!dogID) return;

    const formData = new FormData();
    formData.append("name", editableFields.name);
    formData.append("age", editableFields.age);
    formData.append("race", editableFields.race);
    formData.append("weight", editableFields.weight);
    formData.append("ownerID", editableFields.ownerID);

    try {
      const response = await fetch(`https://localhost:7202/Dog/${dogID}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const updatedDog = await response.json();
      setDog(updatedDog);
      
      // Update owner if it changed
      if (dog?.ownerID !== Number.parseInt(editableFields.ownerID)) {
        const newOwner = owners.find(owner => owner.ownerID.toString() === editableFields.ownerID);
        setOwner(newOwner || null);
      }
      
      setIsEditingDetails(false);
    } catch (error) {
      console.error("Error updating dog details:", error);
    }
  };

  const handleCancelDetailsEdit = () => {
    if (dog) {
      setEditableFields({
        name: dog.name || "",
        age: dog.age?.toString() || "",
        race: dog.race || "",
        weight: dog.weight?.toString() || "",
        ownerID: dog.ownerID?.toString() || "",
      });
    }
    setShowOwnerDropdown(false);
    setIsEditingDetails(false);
  };

  const handleDelete = async () => {
    if (!dogID) return;
    try {
      await deleteDog(Number.parseInt(dogID, 10));
      navigate("/dogs");
    } catch (err) {
      console.error("Error deleting dog:", err);
    }
  };

  const handleImageUploadClick = () => {
    setIsEditingImage(true);
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dogID) return;
    if (!e.target.files || e.target.files.length === 0) {
      setIsEditingImage(false);
      return;
    }

    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("Bild ist zu groß. Maximale Größe beträgt 2MB.");
      setIsEditingImage(false);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Ungültiger Dateityp. Nur JPG, PNG und GIF sind erlaubt.");
      setIsEditingImage(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://localhost:7202/Dog/upload-image/${dogID}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setImageError(false);
      setDog((prev) => (prev ? { ...prev } : null));
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes:", error);
      alert("Fehler beim Hochladen des Bildes.");
    } finally {
      setIsEditingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleTreatmentClick = (treatmentID: number) => {
    navigate(`/treatments/${treatmentID}`);
  };

  const handleAddTreatment = () => {
    navigate(`/treatments/create?dogID=${dogID}`);
  };

  const handleCancelDescription = () => {
    setDescription(dog?.description || "");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border text-center">
        <p className="text-muted-foreground">Hund nicht gefunden</p>
        <button
          onClick={handleBack}
          className="mt-4 bg-[#ff6c3e] hover:bg-[#e55c2e] text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Zurück zur Übersicht
        </button>
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
            <h1 className="text-3xl font-bold text-foreground">{dog.name}</h1>
            <p className="text-muted-foreground mt-1">
              Details und Informationen zum Hund
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">Bild</h2>
            <button
              onClick={handleImageUploadClick}
              className="text-card-foreground p-1 rounded-full hover:bg-accent cursor-pointer"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {isEditingImage ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground mb-2"></div>
                  <p className="text-muted-foreground">
                    Bild wird hochgeladen...
                  </p>
                </div>
              ) : dog.dogID && !imageError ? (
                <img
                  src={getImageUrl(dog.dogID) || "/placeholder.svg"}
                  alt={dog.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <DogIcon className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Kein Bild vorhanden</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unterstützte Formate: JPG, PNG, GIF. Maximale Größe: 2MB.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              Details
            </h2>
            <button
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className="text-card-foreground p-1 rounded-full hover:bg-accent cursor-pointer"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Name
                </label>
                {isEditingDetails ? (
                  <input
                    type="text"
                    value={editableFields.name}
                    onChange={handleFieldChange}
                    name="name"
                    className="w-full bg-muted text-card-foreground p-3 rounded-lg border border-input"
                  />
                ) : (
                  <div className="bg-muted text-card-foreground p-3 rounded-lg">
                    {dog.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Alter
                </label>
                {isEditingDetails ? (
                  <input
                    type="number"
                    value={editableFields.age}
                    onChange={handleFieldChange}
                    name="age"
                    className="w-full bg-muted text-card-foreground p-3 rounded-lg border border-input"
                  />
                ) : (
                  <div className="bg-muted text-card-foreground p-3 rounded-lg">
                    {dog.age}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Rasse
                </label>
                {isEditingDetails ? (
                  <input
                    type="text"
                    value={editableFields.race}
                    onChange={handleFieldChange}
                    name="race"
                    className="w-full bg-muted text-card-foreground p-3 rounded-lg border border-input"
                  />
                ) : (
                  <div className="bg-muted text-card-foreground p-3 rounded-lg">
                    {dog.race}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Gewicht (kg)
                </label>
                {isEditingDetails ? (
                  <input
                    type="number"
                    value={editableFields.weight}
                    onChange={handleFieldChange}
                    name="weight"
                    className="w-full bg-muted text-card-foreground p-3 rounded-lg border border-input"
                  />
                ) : (
                  <div className="bg-muted text-card-foreground p-3 rounded-lg">
                    {dog.weight}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-muted-foreground mb-1">
                  Besitzer
                </label>
                {isEditingDetails ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                      className="w-full bg-muted text-card-foreground p-3 rounded-lg border border-input text-left flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6c3e]"
                    >
                      {getSelectedOwner() ? (
                        `${getSelectedOwner()?.firstName} ${getSelectedOwner()?.lastName}`
                      ) : (
                        "Besitzer auswählen"
                      )}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          showOwnerDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showOwnerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {owners.length === 0 ? (
                          <div className="px-4 py-2 text-muted-foreground">
                            Keine Besitzer gefunden
                          </div>
                        ) : (
                          owners.map((ownerOption) => (
                            <button
                              key={ownerOption.ownerID}
                              type="button"
                              onClick={() => handleOwnerSelect(ownerOption)}
                              className="w-full px-4 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none cursor-pointer"
                            >
                              <div className="font-medium">
                                {ownerOption.firstName} {ownerOption.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {ownerOption.email}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted text-card-foreground p-3 rounded-lg">
                    {owner ? (
                      <button
                        onClick={() => navigate(`/owner/${owner.ownerID}`)}
                        className="bg-[#ff6c3e] hover:bg-[#e55c2e] text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors"
                      >
                        {owner.firstName} {owner.lastName}
                      </button>
                    ) : (
                      `ID: ${dog?.ownerID || "Unbekannt"}`
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditingDetails && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancelDetailsEdit}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 bg-[#ff6c3e] hover:bg-[#e55c2e] text-white rounded-lg cursor-pointer"
                >
                  Speichern
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 mb-4">
        <div className="inline-flex bg-card rounded-lg overflow-hidden border border-border">
          <button
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "description"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Beschreibung
          </button>
          <button
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "treatments"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            }`}
            onClick={() => setActiveTab("treatments")}
          >
            Behandlungen
          </button>
        </div>
      </div>

      {activeTab === "description" && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              Beschreibung
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-card-foreground p-1 rounded-full hover:bg-accent cursor-pointer"
            >
              <Pencil size={20} />
            </button>
          </div>
          <div className="p-6">
            {isEditing ? (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[150px] bg-muted text-card-foreground p-3 rounded-lg border border-input resize-none"
                  placeholder="Keine Beschreibung vorhanden"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCancelDescription}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="px-4 py-2 bg-[#ff6c3e] hover:bg-[#e55c2e] text-white rounded-lg cursor-pointer"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-card-foreground">
                {description || "Keine Beschreibung vorhanden."}
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "treatments" && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              Behandlungen
            </h2>
            <button
              onClick={handleAddTreatment}
              className="bg-[#ff6c3e] hover:bg-[#e55c2e] text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus size={16} />
              Neue Behandlung
            </button>
          </div>

          {treatmentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff6c3e]"></div>
            </div>
          ) : treatments.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                Keine Behandlungen vorhanden.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {treatments.map((treatment) => (
                <div
                  key={treatment.treatmentID}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors border border-transparent hover:border-[#ff6c3e]"
                  onClick={() => handleTreatmentClick(treatment.treatmentID)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-[#ff6c3e]/10 rounded-full">
                      <Calendar className="h-5 w-5 text-[#ff6c3e]" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Behandlung{" "}
                        <span className="text-sm text-muted-foreground">
                          #{treatment.treatmentID}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {parseLocalDate(treatment.date).toLocaleDateString(
                          "de-DE"
                        )}
                        , {formatTime(treatment.time)}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#ff6c3e] font-semibold">
                    {treatment.cost.toFixed(2)} CHF
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Hund löschen
            </h3>
            <p className="text-muted-foreground mb-6">
              Möchtest du den Hund "{dog.name}" wirklich löschen? Diese Aktion
              kann nicht rückgängig gemacht werden.
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

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default DogDetail;
