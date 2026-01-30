import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import PropertyCard from "@/components/PropertyCard";
import { Link } from "react-router-dom";
import { useProperties } from "@/api/property.api";
import { useState } from "react";

const Index = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useProperties(page, limit);

  console.log("API RESPONSE:", data);

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center">Failed to load data</div>;
  }

  const properties = data?.data ?? [];

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
            Discover unique stays and experiences around the world. From cozy
            cabins to luxury villas.
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
        {/* PROPERTY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">
              No properties found
            </p>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                images={
                  property.gallery?.length
                    ? property.gallery
                    : property.coverImage
                      ? [property.coverImage]
                      : []
                }
                title={property.title}
                distance={property.propertyType}
                guests={property.guests}
                price={property.pricing.perNight}
                rating={property.rating?.avg ?? 0}
                isSuperhost={property.propertyType}
              />
            ))
          )}
        </div>
        {/* </div> */}

        {/* CTA Section */}
        <section className="mt-16 py-12 px-8 bg-gradient-to-r from-foreground to-foreground/90 text-background rounded-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to host your space?
          </h2>
          <p className="text-background/80 mb-6 max-w-xl mx-auto">
            Join millions of hosts and earn extra income sharing your space with
            guests.
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
                <li>
                  <a href="#" className="hover:underline">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    AirCover
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Safety information
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hosting</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:underline">
                    Airbnb your home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    AirCover for Hosts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Hosting resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Airbnb</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:underline">
                    Newsroom
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    New features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Facebook
                  </a>
                </li>
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
