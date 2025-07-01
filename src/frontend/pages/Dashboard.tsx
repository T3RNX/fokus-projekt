"use client";

import type React from "react";
import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import { getAllDogs, getImageUrl } from "../API/Dog";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Calendar } from "lucide-react";
import { isToday, parseLocalDate, formatTime } from "../src/lib/date-utils";

interface Treatment {
  treatmentID: number;
  dogID: number;
  description: string;
  date: string;
  time: string;
  cost: number;
  dogName?: string;
}

interface Owner {
  ownerID: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface DashboardStats {
  totalDogs: number;
  newDogsThisMonth: number;
  totalOwners: number;
  newOwnersThisMonth: number;
  totalTreatments: number;
  newTreatmentsThisMonth: number;
  upcomingAppointments: number;
  nextAppointmentDate: string | null;
  nextAppointmentTime: string | null;
  recentTreatments: Treatment[];
  upcomingTreatments: Treatment[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDogs: 0,
    newDogsThisMonth: 0,
    totalOwners: 0,
    newOwnersThisMonth: 0,
    totalTreatments: 0,
    newTreatmentsThisMonth: 0,
    upcomingAppointments: 0,
    nextAppointmentDate: null,
    nextAppointmentTime: null,
    recentTreatments: [],
    upcomingTreatments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dogNames, setDogNames] = useState<Record<number, string>>({});
  const [lastViewedTreatmentId, setLastViewedTreatmentId] = useState<
    number | null
  >(null);
  const [todaysTreatments, setTodaysTreatments] = useState<Treatment[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("lastViewedTreatmentId");
    if (storedId) {
      setLastViewedTreatmentId(Number(storedId));
    }
  }, []);

  const handleTreatmentClick = (treatmentID: number) => {
    setLastViewedTreatmentId(treatmentID);
    localStorage.setItem("lastViewedTreatmentId", treatmentID.toString());
    navigate(`/treatments/${treatmentID}`);
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dogs = await getAllDogs();
      const totalDogs = dogs.length;

      const dogNameMap: Record<number, string> = {};
      dogs.forEach((dog: any) => {
        if (dog.dogID && dog.name) {
          dogNameMap[dog.dogID] = dog.name;
        }
      });
      setDogNames(dogNameMap);

      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const newDogsThisMonth = dogs.filter((dog: any) => {
        const dogDate = dog.createdAt ? parseLocalDate(dog.createdAt) : null;
        return dogDate && dogDate >= firstDayOfMonth;
      }).length;

      let owners: Owner[] = [];
      let totalOwners = 0;
      let newOwnersThisMonth = 0;

      try {
        const ownersResponse = await fetch("https://localhost:7202/Owner");
        if (ownersResponse.ok) {
          owners = await ownersResponse.json();
          totalOwners = owners.length;

          newOwnersThisMonth = owners.filter((owner: any) => {
            const ownerDate = owner.createdAt
              ? parseLocalDate(owner.createdAt)
              : null;
            return ownerDate && ownerDate >= firstDayOfMonth;
          }).length;
        }
      } catch (err) {
        console.error("Error fetching owners:", err);
      }

      let treatments: Treatment[] = [];
      let totalTreatments = 0;
      let newTreatmentsThisMonth = 0;

      try {
        const treatmentsResponse = await fetch(
          "https://localhost:7202/Treatment"
        );
        if (treatmentsResponse.ok) {
          treatments = await treatmentsResponse.json();
          totalTreatments = treatments.length;

          treatments = treatments.map((treatment) => ({
            ...treatment,
            dogName: dogNameMap[treatment.dogID] || undefined,
          }));

          newTreatmentsThisMonth = treatments.filter((treatment) => {
            const treatmentDate = parseLocalDate(treatment.date);
            return (
              !isNaN(treatmentDate.getTime()) &&
              treatmentDate >= firstDayOfMonth
            );
          }).length;

          const recentTreatments = [...treatments]
            .filter(
              (treatment) => !isNaN(parseLocalDate(treatment.date).getTime())
            )
            .sort(
              (a, b) =>
                parseLocalDate(b.date).getTime() -
                parseLocalDate(a.date).getTime()
            )
            .slice(0, 5);

          const validTreatments = treatments.filter((treatment) => {
            const treatmentDate = parseLocalDate(treatment.date);
            return !isNaN(treatmentDate.getTime());
          });

          const upcomingTreatments = validTreatments
            .filter((treatment) => {
              const treatmentDate = parseLocalDate(treatment.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return treatmentDate >= today;
            })
            .sort((a, b) => {
              const dateComparison =
                parseLocalDate(a.date).getTime() -
                parseLocalDate(b.date).getTime();
              if (dateComparison !== 0) return dateComparison;

              return a.time.localeCompare(b.time);
            });

          const upcomingAppointments = upcomingTreatments.length;

          const nextAppointmentDate =
            upcomingTreatments.length > 0 ? upcomingTreatments[0].date : null;
          const nextAppointmentTime =
            upcomingTreatments.length > 0 ? upcomingTreatments[0].time : null;

          const todaysAppointments = treatments.filter((treatment) =>
            isToday(treatment.date)
          );

          todaysAppointments.sort((a, b) => a.time.localeCompare(b.time));

          setTodaysTreatments(todaysAppointments);

          setStats((prev) => ({
            ...prev,
            totalTreatments,
            newTreatmentsThisMonth,
            upcomingAppointments,
            nextAppointmentDate,
            nextAppointmentTime,
            recentTreatments,
            upcomingTreatments: upcomingTreatments.slice(0, 5),
          }));
        }
      } catch (err) {
        console.error("Error fetching treatments:", err);
      }

      setStats((prev) => ({
        ...prev,
        totalDogs,
        newDogsThisMonth,
        totalOwners,
        newOwnersThisMonth,
      }));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Fehler beim Laden der Dashboard-Daten");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Keine";

    try {
      const date = parseLocalDate(dateString);

      if (isNaN(date.getTime())) {
        return "Keine";
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return "Heute";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Morgen";
      } else {
        return date.toLocaleDateString("de-DE");
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Keine";
    }
  };

  return (
    <div>
      <div className="mb-6 relative">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Willkommen bei bdogs, Ihrem Toolkit für die Tierverwaltung
        </p>
        <div className="absolute right-0 top-0">
          <button
            onClick={fetchDashboardData}
            className="bg-secondary text-secondary-foreground p-2 rounded-lg hover:bg-secondary/80 flex items-center justify-center"
            disabled={isLoading}
            title="Aktualisieren"
          >
            <RefreshCw
              size={20}
              className={`${isLoading ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Aktualisieren</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Hunde"
          value={stats.totalDogs}
          subtitle={`${stats.newDogsThisMonth > 0 ? "+" : ""}${
            stats.newDogsThisMonth
          } seit letztem Monat`}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
              <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
              <path d="M8 14v.5" />
              <path d="M16 14v.5" />
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
            </svg>
          }
        />

        <DashboardCard
          title="Besitzer"
          value={stats.totalOwners}
          subtitle={`${stats.newOwnersThisMonth > 0 ? "+" : ""}${
            stats.newOwnersThisMonth
          } seit letztem Monat`}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M18 21a8 8 0 0 0-16 0" />
              <circle cx="10" cy="8" r="5" />
              <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
            </svg>
          }
        />

        <DashboardCard
          title="Behandlungen"
          value={stats.totalTreatments}
          subtitle={`${stats.newTreatmentsThisMonth > 0 ? "+" : ""}${
            stats.newTreatmentsThisMonth
          } seit letztem Monat`}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          }
        />

        <DashboardCard
          title="Anstehende Termine"
          value={stats.upcomingAppointments}
          subtitle={`Nächster Termin: ${
            stats.nextAppointmentDate
              ? `${formatDate(stats.nextAppointmentDate)}, ${formatTime(
                  stats.nextAppointmentTime || ""
                )}`
              : "Keine"
          }`}
          isLoading={isLoading}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          }
        />
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-[#ff6c3e]" />
            Heute fällige Behandlungen
            {todaysTreatments.length > 0 && (
              <span className="ml-2 text-sm bg-[#ff6c3e] text-white px-2 py-0.5 rounded-full">
                {todaysTreatments.length}
              </span>
            )}
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff6c3e]"></div>
            </div>
          ) : todaysTreatments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Keine Behandlungen für heute geplant.
            </p>
          ) : (
            <div className="space-y-3">
              {todaysTreatments.map((treatment) => (
                <div
                  key={treatment.treatmentID}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg cursor-pointer transition-colors border border-[#ff6c3e] hover:bg-muted/90"
                  onClick={() => handleTreatmentClick(treatment.treatmentID)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-muted-foreground/10">
                      <img
                        src={getImageUrl(treatment.dogID) || "/placeholder.svg"}
                        alt="Hund"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/40";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        Behandlung #{treatment.treatmentID}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {treatment.dogName ||
                          dogNames[treatment.dogID] ||
                          `Hund #${treatment.dogID}`}{" "}
                        •{" "}
                        <span className="font-semibold text-[#ff6c3e]">
                          Heute, {formatTime(treatment.time)}
                        </span>
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
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold text-foreground mb-4">Übersicht</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">
              Kürzlich Besucht
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff6c3e]"></div>
              </div>
            ) : stats.recentTreatments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Keine kürzlichen Behandlungen gefunden.
              </p>
            ) : (
              <div className="space-y-3">
                {[...stats.recentTreatments]
                  .sort((a, b) => {
                    if (a.treatmentID === lastViewedTreatmentId) return -1;
                    if (b.treatmentID === lastViewedTreatmentId) return 1;
                    return (
                      parseLocalDate(b.date).getTime() -
                      parseLocalDate(a.date).getTime()
                    );
                  })
                  .map((treatment) => (
                    <div
                      key={treatment.treatmentID}
                      className={`flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors border ${
                        treatment.treatmentID === lastViewedTreatmentId
                          ? "border-[#ff6c3e]"
                          : "border-transparent hover:border-[#ff6c3e]"
                      }`}
                      onClick={() =>
                        handleTreatmentClick(treatment.treatmentID)
                      }
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-muted-foreground/10">
                          <img
                            src={
                              getImageUrl(treatment.dogID) || "/placeholder.svg"
                            }
                            alt="Hund"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/40";
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            Behandlung #{treatment.treatmentID}
                            {treatment.treatmentID ===
                              lastViewedTreatmentId && (
                              <span className="ml-2 text-xs text-[#ff6c3e]">
                                Zuletzt angesehen
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {treatment.dogName ||
                              dogNames[treatment.dogID] ||
                              `Hund #${treatment.dogID}`}{" "}
                            •{" "}
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">
              Anstehende Behandlungen
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff6c3e]"></div>
              </div>
            ) : stats.upcomingTreatments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Keine anstehenden Behandlungen gefunden.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.upcomingTreatments.map((treatment) => (
                  <div
                    key={treatment.treatmentID}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors border border-transparent hover:border-[#ff6c3e]"
                    onClick={() => handleTreatmentClick(treatment.treatmentID)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-muted-foreground/10">
                        <img
                          src={
                            getImageUrl(treatment.dogID) || "/placeholder.svg"
                          }
                          alt="Hund"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/40";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          Behandlung #{treatment.treatmentID}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {treatment.dogName ||
                            dogNames[treatment.dogID] ||
                            `Hund #${treatment.dogID}`}{" "}
                          •{" "}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
