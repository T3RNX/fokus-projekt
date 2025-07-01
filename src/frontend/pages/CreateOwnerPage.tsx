"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2,
} from "lucide-react";
import { createOwner, type CreateOwnerDTO } from "../API/Owner";
import { useNavigate } from "react-router-dom";

interface CreateOwnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface CreateOwnerPageProps {
  onNavigateBack?: () => void;
  onOwnerCreated?: (ownerId: number) => void;
}

const CreateOwnerPage: React.FC<CreateOwnerPageProps> = ({
  onNavigateBack,
  onOwnerCreated,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateOwnerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Schweiz",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<CreateOwnerFormData>>({});

  const handleInputChange = (
    field: keyof CreateOwnerFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateOwnerFormData> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vorname ist erforderlich";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nachname ist erforderlich";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefonnummer ist erforderlich";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adresse ist erforderlich";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Stadt ist erforderlich";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postleitzahl ist erforderlich";
    } else if (!/^\d{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Postleitzahl muss 4 Ziffern haben";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Bitte überprüfen Sie die markierten Felder.");
      return;
    }

    setLoading(true);

    try {
      const ownerData: CreateOwnerDTO = {
        ownerID: 0,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        alternativePhone: formData.alternativePhone.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      };

      const createdOwner = await createOwner(ownerData);

      alert(
        `${formData.firstName} ${formData.lastName} wurde erfolgreich hinzugefügt.`
      );

      if (onOwnerCreated) {
        onOwnerCreated(createdOwner.ownerID);
      } else if (onNavigateBack) {
        onNavigateBack();
      }
    } catch (error: any) {
      console.error("Error creating owner:", error);
      alert(
        error.message ||
          "Beim Erstellen des Besitzers ist ein Fehler aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternativePhone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Deutschland",
      notes: "",
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/owner")} className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Neuer Besitzer
            </h1>
            <p className="text-muted-foreground mt-1">
              Fügen Sie einen neuen Besitzer hinzu
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Persönliche Informationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Vorname <span className="text-red-500">*</span>
                </div>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Max"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Nachname <span className="text-red-500">*</span>
                </div>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Mustermann"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Kontaktinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">
                E-Mail <span className="text-red-500">*</span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="max.mustermann@email.com"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Telefon <span className="text-red-500">*</span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+41 79 123 45 67"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Alternative Telefonnummer
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="alternativePhone"
                    value={formData.alternativePhone}
                    onChange={(e) =>
                      handleInputChange("alternativePhone", e.target.value)
                    }
                    placeholder="+41 79 123 45 67"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Adressinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">
                Straße und Hausnummer <span className="text-red-500">*</span>
              </div>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Musterstrasse 123"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Postleitzahl <span className="text-red-500">*</span>
                </div>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="12345"
                  maxLength={5}
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">{errors.postalCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Stadt <span className="text-red-500">*</span>
                </div>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Musterstadt"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">Land</div>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Deutschland"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Zusätzliche Informationen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Notizen</div>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Zusätzliche Informationen über den Besitzer..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Optional: Besondere Hinweise oder Anmerkungen
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="cursor-pointer"
          >
            Zurücksetzen
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={loading}
            className="cursor-pointer"
          >
            Abbrechen
          </Button>
          <Button type="submit" disabled={loading} className="cursor-pointer" onClick={handleBack}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Besitzer erstellen
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOwnerPage;
