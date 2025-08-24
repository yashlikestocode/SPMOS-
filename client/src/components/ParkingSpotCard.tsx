import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, ArrowRight } from 'lucide-react';
import type { ParkingSpot } from '@shared/schema';
import { formatCurrency } from '@/utils/currency';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onClick: () => void;
}

export default function ParkingSpotCard({ spot, onClick }: ParkingSpotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'almost_full':
        return 'status-almost-full';
      case 'full':
        return 'status-full';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'almost_full':
        return 'Almost Full';
      case 'full':
        return 'Full';
      default:
        return 'Unknown';
    }
  };

  const isDisabled = spot.status === 'full';

  return (
    <Card 
      className={`card-hover overflow-hidden cursor-pointer ${isDisabled ? 'opacity-75' : ''}`}
      onClick={!isDisabled ? onClick : undefined}
      data-testid={`card-parking-spot-${spot.id}`}
    >
      <div className="relative">
        <img
          src={spot.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
          alt={`${spot.name} parking area`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor(spot.status)} font-medium`}>
            <div className="w-2 h-2 rounded-full bg-current mr-2" />
            {getStatusText(spot.status)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white text-primary font-bold">
            {formatCurrency(spot.hourlyRate)}/hr
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2" data-testid={`text-spot-name-${spot.id}`}>
          {spot.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4" data-testid={`text-spot-address-${spot.id}`}>
          {spot.address}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className={`font-medium ${spot.status === 'full' ? 'text-accent' : 'text-secondary'}`}>
              <Car className="inline h-4 w-4 mr-1" />
              <span data-testid={`text-spot-availability-${spot.id}`}>
                {spot.availableSpots}/{spot.totalSpots}
              </span>
            </span>
            <span className="text-muted-foreground">
              <Clock className="inline h-4 w-4 mr-1" />
              {spot.operatingHours}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            data-testid={`button-book-spot-${spot.id}`}
            className="text-primary hover:text-blue-700 font-medium p-0"
          >
            {isDisabled ? (
              <>
                Full
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Book Now
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
