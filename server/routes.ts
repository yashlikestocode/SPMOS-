import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid login data" });
    }
  });

  // Parking spots routes
  app.get("/api/parking-spots", async (req, res) => {
    try {
      const query = req.query.search as string;
      const spots = query 
        ? await storage.searchParkingSpots(query)
        : await storage.getAllParkingSpots();
      res.json(spots);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch parking spots" });
    }
  });

  app.get("/api/parking-spots/:id", async (req, res) => {
    try {
      const spot = await storage.getParkingSpot(req.params.id);
      if (!spot) {
        return res.status(404).json({ message: "Parking spot not found" });
      }
      res.json(spot);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch parking spot" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Update parking spot availability
      const spot = await storage.getParkingSpot(bookingData.parkingSpotId);
      if (spot && spot.availableSpots > 0) {
        await storage.updateParkingSpotAvailability(
          bookingData.parkingSpotId, 
          spot.availableSpots - 1
        );
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid booking data" });
    }
  });

  app.patch("/api/bookings/:id/complete", async (req, res) => {
    try {
      const { totalCost } = req.body;
      const booking = await storage.updateBookingStatus(
        req.params.id,
        "completed",
        new Date(),
        totalCost
      );
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update parking spot availability (free up the spot)
      const spot = await storage.getParkingSpot(booking.parkingSpotId);
      if (spot) {
        await storage.updateParkingSpotAvailability(
          booking.parkingSpotId, 
          spot.availableSpots + 1
        );
      }

      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to complete booking" });
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch user bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
