"use client";

import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Search, Moon, Sun } from "lucide-react";
import { useThemeToggle } from "../hooks/useThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div
        className={`${
          isMobile
            ? `fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64 min-w-64 h-full"
        }`}
      >
        <Sidebar
          onClickItem={isMobile ? () => setSidebarOpen(false) : undefined}
        />
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center px-4 relative">
          <div className="flex items-center w-1/4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-card-foreground p-2 rounded-md hover:bg-accent cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-card-foreground border border-input rounded-lg bg-muted focus:ring-primary focus:border-primary outline-none"
                placeholder="Suchen..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-1/4">
            <button
              onClick={toggleTheme}
              className="text-card-foreground p-2 rounded-full hover:bg-accent cursor-pointer"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
