"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Button } from "../components/ui/Button";
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
import { Badge } from "../components/ui/Badge";
import {
  Search,
  Users,
  UserPlus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Plus,
} from "lucide-react";

import { deleteOwner } from "../API/Owner";

interface Dog {
  dogID: number;
  name: string;
  breed: string;
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
  dogs: Dog[];
  lastVisit?: string;
}

interface OwnerProps {
  onNavigateToCreate?: () => void;
  onNavigateToDetails?: (ownerId: number) => void;
  onNavigateToEdit?: (ownerId: number) => void;
}

const Owner: React.FC<OwnerProps> = ({
  onNavigateToCreate,
  onNavigateToDetails,
  onNavigateToEdit,
}) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [
    ,/*1*/
    /*2*/
  ] = useState("all");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch("https://localhost:7202/Owner");
        if (!response.ok) throw new Error("Failed to fetch owners");
        const data = await response.json();
        setOwners(data);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const filteredAndSortedOwners = useMemo(() => {
    const filtered = owners.filter((owner) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        owner.firstName.toLowerCase().includes(searchLower) ||
        owner.lastName.toLowerCase().includes(searchLower) ||
        owner.email.toLowerCase().includes(searchLower) ||
        owner.phone.includes(searchTerm)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "email":
          return a.email.localeCompare(b.email);
        case "city":
          return a.city.localeCompare(b.city);
        case "pets":
          const aDogsCount = a.dogs ? a.dogs.length : 0;
          const bDogsCount = b.dogs ? b.dogs.length : 0;
          return bDogsCount - aDogsCount;
        case "recent":
          const aDate = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const bDate = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });
  }, [owners, searchTerm, sortBy]);

  const handleDeleteOwner = async () => {
    if (!ownerToDelete) return;

    try {
      await deleteOwner(ownerToDelete.ownerID);
      setOwners((prev) =>
        prev.filter((o) => o.ownerID !== ownerToDelete.ownerID)
      );
    } catch (error) {
      console.error("Fehler beim Löschen des Besitzers:", error);
      alert("Fehler beim Löschen. Bitte erneut versuchen.");
    } finally {
      setShowDeleteDialog(false);
      setOwnerToDelete(null);
    }
  };

  const handleViewOwner = (id: number) => {
    if (onNavigateToDetails) {
      onNavigateToDetails(id);
    } else {
      navigate(`/owner/${id}`);
    }
  };

  const handleEditOwner = (id: number) => {
    onNavigateToEdit
      ? onNavigateToEdit(id)
      : console.log("Navigate to edit owner:", id);
  };

  const handleCreateOwner = () => {
    if (onNavigateToCreate) {
      onNavigateToCreate();
    } else {
      navigate("/owner/create");
    }
  };

  const stats = useMemo(() => {
    const total = owners.length;
    const withPets = owners.filter((o) => o.dogs && o.dogs.length > 0).length;
    const recentVisits = owners.filter((o) => {
      if (!o.lastVisit) return false;
      const lastVisitDate = new Date(o.lastVisit);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastVisitDate >= thirtyDaysAgo;
    }).length;

    return { total, withPets, recentVisits };
  }, [owners]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
  };

  if (loading) return <p className="text-muted-foreground">Lade Besitzer...</p>;
  if (error) return <p className="text-destructive">Fehler: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Besitzer</h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie die Besitzer und deren Informationen
          </p>
        </div>
        <Button onClick={handleCreateOwner} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Besitzer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gesamt Besitzer
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mit Haustieren
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withPets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Letzte Besuche
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentVisits}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 overflow-visible">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Suchen nach Name, E-Mail oder Telefon..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            {(searchTerm || sortBy !== "name") && (
              <Button variant="outline" onClick={clearFilters}>
                Filter zurücksetzen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Besitzerliste ({filteredAndSortedOwners.length} von {owners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedOwners.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Haustiere</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOwners.map((owner) => (
                    <TableRow
                      key={owner.ownerID}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewOwner(owner.ownerID)}
                    >
                      <TableCell className="font-medium">
                        <div className="font-semibold">
                          {owner.firstName} {owner.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1" />
                            {owner.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {owner.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{owner.address}</div>
                          <div className="text-muted-foreground">
                            {owner.postalCode} {owner.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {owner.dogs.length}{" "}
                          {owner.dogs.length === 1 ? "Haustier" : "Haustiere"}
                        </Badge>
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
                          <DropdownMenuContent
                            align="end"
                            className="cursor-pointer"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/owner/${owner.ownerID}`);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Anzeigen
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setOwnerToDelete(owner);
                                setShowDeleteDialog(true);
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
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">
                Keine Besitzer gefunden
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Versuchen Sie, Ihre Suchkriterien zu ändern."
                  : "Beginnen Sie, indem Sie Ihren ersten Besitzer hinzufügen."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button
                    onClick={handleCreateOwner}
                    className="cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Neuer Besitzer
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showDeleteDialog && ownerToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Besitzer löschen
            </h3>
            <p className="text-muted-foreground mb-6">
              Möchtest du den Besitzer "{ownerToDelete.firstName}{" "}
              {ownerToDelete.lastName}" wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setOwnerToDelete(null);
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteOwner}
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

export default Owner;
