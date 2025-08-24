import { useParking } from '@/contexts/ParkingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Smartphone, IndianRupee } from 'lucide-react';

export default function LandingPage() {
  const { setCurrentView } = useParking();

  const testimonials = [
    {
      name: "Tenzin Sherpa",
      role: "Local Business Owner",
      initial: "TS",
      text: "SPMOS has made parking in MG Marg so much easier for my customers. The real-time availability is a game-changer!",
      bgColor: "bg-primary"
    },
    {
      name: "Pema Lama", 
      role: "Tourist Guide",
      initial: "PL",
      text: "As a tourist guide, I recommend SPMOS to all visitors. It saves time and reduces stress when exploring Gangtok.",
      bgColor: "bg-secondary"
    },
    {
      name: "Karma Gyatso",
      role: "IT Professional", 
      initial: "KG",
      text: "The app is incredibly user-friendly and the pricing is transparent. Perfect for daily commuters like me.",
      bgColor: "bg-yellow-500"
    }
  ];

  return (
    <div data-testid="page-landing">
      {/* Hero Section */}
      <div className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Perfect Parking
              <span className="block text-yellow-300">in Sikkim</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Smart, efficient parking solutions for Gangtok, Namchi, and across beautiful Sikkim. 
              Real-time availability, easy booking, seamless experience.
            </p>
            <Button
              size="lg"
              data-testid="button-findParking"
              className="bg-white text-primary hover:bg-slate-100 px-8 py-4 text-lg font-semibold shadow-lg"
              onClick={() => setCurrentView('search')}
            >
              Find Parking Spots
              <Search className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SPMOS?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of parking with our smart optimization system designed for Sikkim's unique landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-0 bg-slate-50 hover:bg-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-Time Search</h3>
                <p className="text-muted-foreground">
                  Find available parking spots instantly across MG Marg, Lal Bazaar, and other prime Sikkim locations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 bg-slate-50 hover:bg-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Booking</h3>
                <p className="text-muted-foreground">
                  Reserve your spot in advance with our intelligent booking system. No more circling around looking for parking.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 bg-slate-50 hover:bg-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IndianRupee className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  Clear, upfront pricing in Indian Rupees. No hidden fees, no surprises. Pay only for what you use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                      {testimonial.initial}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold" data-testid={`text-testimonial-name-${index}`}>
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground" data-testid={`text-testimonial-content-${index}`}>
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
