"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  User,
  Heart,
  Calendar,
  MoreHorizontal,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";
import { getOwnerById } from "../API/Owner";
import { useParams, useNavigate } from "react-router-dom";
import { deleteDog } from "../API/Dog";

interface Dog {
  dogID: number;
  name: string;
  race: string;
  age?: number;
  weight?: number;
  color?: string;
  gender?: string;
  microchipNumber?: string;
  registrationDate?: string;
  lastVisit?: string;
  medicalNotes?: string;
}

interface Owner {
  ownerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  registrationDate?: string;
  lastVisit?: string;
  notes?: string;
  dogs: Dog[];
}

interface OwnerDetailsProps {
  onNavigateBack?: () => void;
  onNavigateToEdit?: (ownerId: number) => void;
  onNavigateToDogDetails?: (dogId: number) => void;
  onNavigateToAddDog?: (ownerId: number) => void;
}

const OwnerDetailsPage: React.FC<OwnerDetailsProps> = ({
  onNavigateToEdit,
  onNavigateToDogDetails,
  onNavigateToAddDog,
}) => {
  const navigate = useNavigate();
  const { ownerID } = useParams<{ ownerID: string }>();
  const ownerId = Number.parseInt(ownerID ?? "", 10);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Owner ID:", ownerId);
    const fetchOwner = async () => {
      try {
        const data = await getOwnerById(ownerId);
        console.log("Fetched owner data:", data); // Debug log
        console.log("Dogs data:", data.dogs); // Debug log for dogs
        setOwner(data);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [ownerId]);

  if (isNaN(ownerId)) {
    return <p className="text-destructive">Ungültige Besitzer-ID</p>;
  }

  const handleEdit = () => {
    onNavigateToEdit
      ? onNavigateToEdit(ownerId)
      : console.log("Navigate to edit owner");
  };

  const handleViewDog = (id: number) => {
    if (onNavigateToDogDetails) {
      onNavigateToDogDetails(id);
    } else {
      navigate(`/dogs/${id}`);
    }
  };
  const handleAddDog = () => {
    navigate("/dogs/create");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openDeleteDialog = (dog: Dog) => {
    setDogToDelete(dog);
    setShowDeleteDialog(true);
  };

  const handleDeleteDog = async () => {
    if (!dogToDelete) return;

    try {
      await deleteDog(dogToDelete.dogID);
      const updatedOwner = await getOwnerById(ownerId);
      setOwner(updatedOwner);
      setShowDeleteDialog(false);
      setDogToDelete(null);
    } catch (err) {
      console.error("Error deleting dog:", err);
    }
  };

  if (loading)
    return <p className="text-muted-foreground">Lade Besitzerdetails...</p>;
  if (error) return <p className="text-destructive">Fehler: {error}</p>;
  if (!owner)
    return <p className="text-muted-foreground">Besitzer nicht gefunden</p>;

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
              {owner.firstName} {owner.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Besitzer seit{" "}
              {owner.registrationDate
                ? new Date(owner.registrationDate).toLocaleDateString("de-DE")
                : "Unbekannt"}
            </p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Bearbeiten
        </Button>
      </div>

      {/* Owner Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Kontaktinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">E-Mail</p>
                <p className="text-sm text-muted-foreground">{owner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">{owner.phone}</p>
                {owner.alternativePhone && (
                  <p className="text-sm text-muted-foreground">
                    Alt: {owner.alternativePhone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">{owner.address}</p>
                <p className="text-sm text-muted-foreground">
                  {owner.postalCode} {owner.city}
                  {owner.country && `, ${owner.country}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Statistiken
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Anzahl Haustiere</span>
              <Badge variant="secondary">{owner.dogs.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Letzter Besuch</span>
              <span className="text-sm text-muted-foreground">
                {owner.lastVisit
                  ? new Date(owner.lastVisit).toLocaleDateString("de-DE")
                  : "Nie"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Registriert seit</span>
              <span className="text-sm text-muted-foreground">
                {owner.registrationDate
                  ? new Date(owner.registrationDate).toLocaleDateString("de-DE")
                  : "Unbekannt"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {owner.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {owner.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Dogs Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Haustiere</h2>
            <p className="text-muted-foreground">
              {owner.dogs.length}{" "}
              {owner.dogs.length === 1 ? "Haustier" : "Haustiere"} registriert
            </p>
          </div>
          <Button onClick={handleAddDog} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Haustier hinzufügen
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {owner.dogs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rasse</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Letzter Besuch</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owner.dogs.map((dog) => {
                      // Debug log for each dog
                      console.log(`Dog ${dog.name}:`, dog);
                      console.log(`Dog race for ${dog.name}:`, dog.race);

                      return (
                        <TableRow
                          key={dog.dogID}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleViewDog(dog.dogID)}
                        >
                          <TableCell className="font-medium">
                            <div className="font-semibold">{dog.name}</div>
                            {dog.microchipNumber && (
                              <div className="text-xs text-muted-foreground">
                                Chip: {dog.microchipNumber}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {dog.race || (
                              <span className="text-muted-foreground italic">
                                Nicht angegeben
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {dog.age && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Alter:
                                  </span>{" "}
                                  {dog.age} Jahre
                                </div>
                              )}
                              {dog.weight && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Gewicht:
                                  </span>{" "}
                                  {dog.weight} kg
                                </div>
                              )}
                              {dog.gender && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Geschlecht:
                                  </span>{" "}
                                  {dog.gender}
                                </div>
                              )}
                              {dog.color && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Farbe:
                                  </span>{" "}
                                  {dog.color}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">
                                {dog.lastVisit
                                  ? new Date(dog.lastVisit).toLocaleDateString(
                                      "de-DE"
                                    )
                                  : "Nie"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDog(dog.dogID);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Details anzeigen
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteDialog(dog);
                                  }}
                                  className="text-destructive cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Löschen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">
                  Keine Haustiere registriert
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fügen Sie das erste Haustier für diesen Besitzer hinzu.
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddDog} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Haustier hinzufügen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {showDeleteDialog && dogToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Hund löschen
            </h3>
            <p className="text-muted-foreground mb-6">
              Möchtest du den Hund "{dogToDelete.name}" wirklich löschen? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDogToDelete(null);
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteDog}
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
};

export default OwnerDetailsPage;
