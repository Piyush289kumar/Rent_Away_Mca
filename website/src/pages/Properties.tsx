import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const Properties = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryFilter />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
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
      </main>
    </div>
  );
};

export default Properties;