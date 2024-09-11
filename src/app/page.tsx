"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import Settings from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/use-settings-store";

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

interface Coordinates {
  latitude: number;
  longitude: number;
}

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

      {coordinates && (
        <div className="h-[740px] w-full">
          <MapContainer
            center={[coordinates.latitude, coordinates.longitude]}
            zoom={1}
            className="h-full w-screen"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[coordinates.latitude, coordinates.longitude]}
            ></Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}
