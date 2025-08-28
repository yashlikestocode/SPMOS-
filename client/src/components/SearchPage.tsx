import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import ParkingSpotCard from "./ParkingSpotCard";
import { useParking } from "@/contexts/ParkingContext";
import type { ParkingSpot } from "@shared/schema";

export default function SearchPage() {
  const { setSelectedSpot, parkingSpots, setCurrentView } = useParking();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredSpots = parkingSpots.filter((spot) => {
    // ... filtering logic remains the same
    const matchesSearch =
      !searchQuery ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      locationFilter === "all" ||
      spot.city.toLowerCase() === locationFilter.toLowerCase();

    const matchesPrice =
      priceFilter === "all" ||
      (() => {
        const rate = parseFloat(spot.hourlyRate);
        switch (priceFilter) {
          case "20-50":
            return rate >= 20 && rate <= 50;
          case "50-100":
            return rate > 50 && rate <= 100;
          case "100+":
            return rate > 100;
          default:
            return true;
        }
      })();

    const matchesAvailability =
      availabilityFilter === "all" || spot.status === availabilityFilter;

    return (
      matchesSearch && matchesLocation && matchesPrice && matchesAvailability
    );
  });

  const availableCount = filteredSpots.filter(
    (spot) => spot.status === "available"
  ).length;

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setCurrentView("booking");
  };

  return (
    // ... JSX remains the same, but data now comes from parkingSpots context
    <div className="min-h-screen bg-slate-50" data-testid="page-search">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search parking spots in Sikkim..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40" data-testid="select-location">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="gangtok">Gangtok</SelectItem>
                  <SelectItem value="namchi">Namchi</SelectItem>
                  <SelectItem value="pelling">Pelling</SelectItem>
                  <SelectItem value="rumtek">Rumtek</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-40" data-testid="select-price">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="20-50">₹20-50/hour</SelectItem>
                  <SelectItem value="50-100">₹50-100/hour</SelectItem>
                  <SelectItem value="100+">₹100+/hour</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger
                  className="w-40"
                  data-testid="select-availability"
                >
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="almost_full">Almost Full</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                data-testid="button-toggle-view"
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Parking Spots</h2>
          <p className="text-muted-foreground">
            <span data-testid="text-total-spots">{filteredSpots.length}</span>{" "}
            parking spots found in Sikkim
            <span className="ml-4 text-secondary">
              <div className="inline-block w-2 h-2 bg-secondary rounded-full mr-1" />
              <span data-testid="text-available-spots">{availableCount}</span>{" "}
              available now
            </span>
          </p>
        </div>

        {/* Parking Spots Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredSpots.map((spot) => (
            <ParkingSpotCard
              key={spot.id}
              spot={spot}
              onClick={() => handleSpotClick(spot)}
            />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No parking spots found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
