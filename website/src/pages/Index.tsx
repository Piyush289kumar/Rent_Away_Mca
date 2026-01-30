import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-coral-light to-background py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Find your next
            <span className="text-primary"> adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Discover unique stays and experiences around the world. From cozy cabins to luxury villas.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in">
            <Link to="/properties" className="btn-coral">
              Explore stays
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </section>

      <CategoryFilter />

      {/* Featured Properties */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured stays</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.slice(0, 8).map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              images={property.images}
              location={property.location}
              distance={property.distance}
              dates={property.dates}
              price={property.price}
              rating={property.rating}
              isSuperhost={property.isSuperhost}
            />
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-16 py-12 px-8 bg-gradient-to-r from-foreground to-foreground/90 text-background rounded-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to host your space?
          </h2>
          <p className="text-background/80 mb-6 max-w-xl mx-auto">
            Join millions of hosts and earn extra income sharing your space with guests.
          </p>
          <Link
            to="/register"
            className="inline-block bg-background text-foreground font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start hosting
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">AirCover</a></li>
                <li><a href="#" className="hover:underline">Safety information</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hosting</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:underline">Airbnb your home</a></li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                <li><a href="#" className="hover:underline">Hosting resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Airbnb</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">New features</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Airbnb Clone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;