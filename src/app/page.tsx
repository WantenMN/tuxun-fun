"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import { Coordinates } from "@/components/map";
import Settings from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/use-settings-store";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function Page() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameId, fun_ticket, SESSION] = useSettingsStore((s) => [
    s.gameId,
    s.fun_ticket,
    s.SESSION,
  ]);

  const handleFetchCoordinates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getCoordinates?gameId=${gameId}&fun_ticket=${fun_ticket}&SESSION=${SESSION}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }
      const data = await response.json();
      setCoordinates(data);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Tuxun Coordinate Map</h1>
        <Settings />
        <Button
          className="my-4"
          onClick={handleFetchCoordinates}
          disabled={isLoading}
        >
          {isLoading ? <RefreshCcw className="animate-spin" /> : <RefreshCcw />}
        </Button>

        {error && <p className="mb-4 text-red-500">{error}</p>}
      </section>

      {coordinates && <Map coordinates={coordinates} />}
    </div>
  );
}
