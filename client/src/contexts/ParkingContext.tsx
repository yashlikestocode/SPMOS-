import { createContext, useContext, useState, useEffect } from 'react';
import type { ParkingSpot, Booking } from '@shared/schema';

interface BookingData {
  spot: ParkingSpot;
  vehicleNumber: string;
  vehicleType: string;
  duration: number;
  startTime: Date;
  totalCost: number;
}

interface SessionData {
  booking: BookingData;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  currentCost: number;
  duration: string;
}

interface ParkingContextType {
  selectedSpot: ParkingSpot | null;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
  bookingData: BookingData | null;
  setBookingData: (booking: BookingData | null) => void;
  sessionData: SessionData | null;
  setSessionData: (session: SessionData | null) => void;
  startSession: (booking: BookingData) => void;
  endSession: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentView, setCurrentView] = useState('landing');

  useEffect(() => {
    // Load session from localStorage on mount
    const savedSession = localStorage.getItem('spmos_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.isActive) {
          setSessionData(parsed);
          setCurrentView('session');
        }
      } catch (error) {
        localStorage.removeItem('spmos_session');
      }
    }

    const savedBooking = localStorage.getItem('spmos_booking');
    if (savedBooking) {
      try {
        setBookingData(JSON.parse(savedBooking));
      } catch (error) {
        localStorage.removeItem('spmos_booking');
      }
    }
  }, []);

  const startSession = (booking: BookingData) => {
    const session: SessionData = {
      booking,
      startTime: new Date(),
      isActive: true,
      currentCost: 0,
      duration: '00:00:00',
    };
    
    setSessionData(session);
    setCurrentView('session');
    localStorage.setItem('spmos_session', JSON.stringify(session));
  };

  const endSession = () => {
    if (sessionData) {
      const endedSession = {
        ...sessionData,
        endTime: new Date(),
        isActive: false,
      };
      setSessionData(endedSession);
      setCurrentView('summary');
      localStorage.setItem('spmos_session', JSON.stringify(endedSession));
    }
  };

  return (
    <ParkingContext.Provider
      value={{
        selectedSpot,
        setSelectedSpot,
        bookingData,
        setBookingData,
        sessionData,
        setSessionData,
        startSession,
        endSession,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}
