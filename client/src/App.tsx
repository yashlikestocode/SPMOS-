import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ParkingProvider, useParking } from "@/contexts/ParkingContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import AuthModal from "@/components/AuthModal";
import NavigationHeader from "@/components/NavigationHeader";
import LandingPage from "@/components/LandingPage";
import SearchPage from "@/components/SearchPage";
import BookingModal from "@/components/BookingModal";
import ParkingSession from "@/components/ParkingSession";
import NavigationModal from "@/components/NavigationModal";
import SessionSummary from "@/components/SessionSummary";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { currentView } = useParking();

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage />;
      case "search":
        return <SearchPage />;
      case "session":
        return <ParkingSession />;
      case "summary":
        return <SessionSummary />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationHeader />
      {renderCurrentView()}
      <BookingModal />
      <NavigationModal />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <ParkingProvider>
          <AppContent />
          <Toaster />
        </ParkingProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
