import type { ParkingSpot } from "@shared/schema";

export const simulateRealTimeUpdates = (
  parkingSpots: ParkingSpot[],
  updateCallback: (updatedSpots: ParkingSpot[]) => void
) => {
  let currentSpots = [...parkingSpots];

  const interval = setInterval(() => {
    currentSpots = currentSpots.map((spot) => {
      // 10% chance to update each spot
      if (Math.random() < 0.1) {
        const change = Math.random() < 0.5 ? -1 : 1;
        const newAvailable = Math.max(
          0,
          Math.min(spot.totalSpots, spot.availableSpots + change)
        );

        let newStatus = "available";
        if (newAvailable === 0) {
          newStatus = "full";
        } else if (newAvailable < spot.totalSpots * 0.3) {
          newStatus = "almost_full";
        }

        return {
          ...spot,
          availableSpots: newAvailable,
          status: newStatus,
        };
      }
      return spot;
    });

    updateCallback(currentSpots);
  }, 5000); // Update every 5 seconds

  return interval;
};

// helper to stop simulation
export const stopSimulation = (interval: NodeJS.Timeout) => {
  clearInterval(interval);
};

export const formatDuration = (
  startTime: Date | string,
  endTime?: Date | string
): string => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();

  const diff = end.getTime() - start.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const calculateCurrentCost = (
  startTime: Date | string,
  hourlyRate: number
): number => {
  const start = new Date(startTime);
  const now = new Date();
  const elapsed = now.getTime() - start.getTime();
  const hours = elapsed / (1000 * 60 * 60);
  return parseFloat((hours * hourlyRate).toFixed(2));
};
