import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Clock, Headphones, Pause } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { formatDuration, calculateCurrentCost } from '@/utils/realTimeUpdates';
import { formatCurrencyDetailed } from '@/utils/currency';

export default function ParkingSession() {
  const { sessionData, endSession, setCurrentView } = useParking();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!sessionData?.isActive || !sessionData.booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">No Active Session</h2>
            <p className="text-muted-foreground mb-4">You don't have an active parking session.</p>
            <Button onClick={() => setCurrentView('search')}>
              Find Parking Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { booking, startTime } = sessionData;
  const duration = formatDuration(startTime);
  const hourlyRate = parseFloat(booking.spot.hourlyRate);
  const currentCost = calculateCurrentCost(startTime, hourlyRate);

  const handleShowNavigation = () => {
    setCurrentView('navigation');
  };

  const handleExtendSession = () => {
    // In a real app, this would open a modal to extend the session
    alert('Extend session functionality would be implemented here');
  };

  const handleContactSupport = () => {
    // In a real app, this would open support chat or call
    alert('Contact support functionality would be implemented here');
  };

  const handleEndSession = () => {
    endSession();
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-session">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Session Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">Active Parking Session</CardTitle>
              <Badge className="status-available font-medium">
                <div className="w-2 h-2 rounded-full bg-current mr-2" />
                In Progress
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2" data-testid="text-session-spot-name">
                  {booking.spot.name}
                </h3>
                <p className="text-muted-foreground text-sm" data-testid="text-session-spot-address">
                  {booking.spot.address}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Vehicle:</span>{' '}
                  <span data-testid="text-session-vehicle">{booking.vehicleNumber}</span>
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1" data-testid="text-session-duration">
                  {duration}
                </div>
                <p className="text-sm text-muted-foreground">Session Duration</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1" data-testid="text-session-cost">
                  {formatCurrencyDetailed(currentCost)}
                </div>
                <p className="text-sm text-muted-foreground">Current Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Route className="inline text-primary mr-2" />
                  Navigation
                </h3>
                <p className="text-muted-foreground">Need directions to your parking spot?</p>
              </div>
              <Button 
                onClick={handleShowNavigation}
                data-testid="button-navigation"
              >
                <Route className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Session Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={handleExtendSession}
                data-testid="button-extend-session"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Extend Session</h4>
                    <p className="text-sm text-muted-foreground">Add more time to your parking</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={handleContactSupport}
                data-testid="button-contact-support"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Headphones className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Get Help</h4>
                    <p className="text-sm text-muted-foreground">Contact customer support</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* End Session */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">End Parking Session</h3>
                <p className="text-muted-foreground">Ready to leave? End your session and complete payment.</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleEndSession}
                data-testid="button-end-session"
              >
                <Pause className="mr-2 h-4 w-4" />
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
