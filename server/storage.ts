import { type User, type InsertUser, type ParkingSpot, type InsertParkingSpot, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Parking spot methods
  getAllParkingSpots(): Promise<ParkingSpot[]>;
  getParkingSpot(id: string): Promise<ParkingSpot | undefined>;
  updateParkingSpotAvailability(id: string, availableSpots: number): Promise<ParkingSpot | undefined>;
  searchParkingSpots(query: string): Promise<ParkingSpot[]>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string, endTime?: Date, totalCost?: number): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private parkingSpots: Map<string, ParkingSpot>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.parkingSpots = new Map();
    this.bookings = new Map();
    
    // Initialize with Sikkim parking spots
    this.initializeParkingSpots();
  }

  private initializeParkingSpots() {
    const sikkimSpots: ParkingSpot[] = [
      {
        id: "1",
        name: "MG Marg Central Parking",
        address: "Near Tibet Road, Gangtok, Sikkim 737101",
        city: "Gangtok",
        state: "Sikkim",
        hourlyRate: "40.00",
        totalSpots: 20,
        availableSpots: 12,
        operatingHours: "24/7",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Lal Bazaar Shopping Complex",
        address: "Market Road, Gangtok, Sikkim 737101",
        city: "Gangtok",
        state: "Sikkim",
        hourlyRate: "35.00",
        totalSpots: 15,
        availableSpots: 3,
        operatingHours: "6AM-10PM",
        status: "almost_full",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Rumtek Monastery Parking",
        address: "Rumtek Road, East Sikkim 737135",
        city: "Rumtek",
        state: "Sikkim",
        hourlyRate: "25.00",
        totalSpots: 30,
        availableSpots: 25,
        operatingHours: "5AM-8PM",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Namchi Central Plaza",
        address: "Central Road, Namchi, South Sikkim 737126",
        city: "Namchi",
        state: "Sikkim",
        hourlyRate: "30.00",
        totalSpots: 25,
        availableSpots: 18,
        operatingHours: "24/7",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Pelling Tourist Hub",
        address: "Upper Pelling, West Sikkim 737113",
        city: "Pelling",
        state: "Sikkim",
        hourlyRate: "45.00",
        totalSpots: 12,
        availableSpots: 0,
        operatingHours: "7AM-9PM",
        status: "full",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "Secretariat Complex Parking",
        address: "Tashiling, Gangtok, Sikkim 737103",
        city: "Gangtok",
        state: "Sikkim",
        hourlyRate: "50.00",
        totalSpots: 10,
        availableSpots: 8,
        operatingHours: "9AM-6PM",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        createdAt: new Date(),
      },
    ];

    sikkimSpots.forEach(spot => {
      this.parkingSpots.set(spot.id, spot);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllParkingSpots(): Promise<ParkingSpot[]> {
    return Array.from(this.parkingSpots.values());
  }

  async getParkingSpot(id: string): Promise<ParkingSpot | undefined> {
    return this.parkingSpots.get(id);
  }

  async updateParkingSpotAvailability(id: string, availableSpots: number): Promise<ParkingSpot | undefined> {
    const spot = this.parkingSpots.get(id);
    if (spot) {
      spot.availableSpots = Math.max(0, Math.min(spot.totalSpots, availableSpots));
      
      // Update status based on availability
      if (spot.availableSpots === 0) {
        spot.status = "full";
      } else if (spot.availableSpots < spot.totalSpots * 0.3) {
        spot.status = "almost_full";
      } else {
        spot.status = "available";
      }
      
      this.parkingSpots.set(id, spot);
    }
    return spot;
  }

  async searchParkingSpots(query: string): Promise<ParkingSpot[]> {
    const allSpots = Array.from(this.parkingSpots.values());
    if (!query) return allSpots;
    
    const lowerQuery = query.toLowerCase();
    return allSpots.filter(spot => 
      spot.name.toLowerCase().includes(lowerQuery) ||
      spot.address.toLowerCase().includes(lowerQuery) ||
      spot.city.toLowerCase().includes(lowerQuery)
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      totalCost: null,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(id: string, status: string, endTime?: Date, totalCost?: number): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      if (endTime) booking.endTime = endTime;
      if (totalCost !== undefined) booking.totalCost = totalCost.toString();
      this.bookings.set(id, booking);
    }
    return booking;
  }
}

export const storage = new MemStorage();
