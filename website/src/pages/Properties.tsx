import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/api/property.api";
import { useState } from "react";

const Properties = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useProperties(page, limit);

  if (isLoading) {
    return <div className="p-10 text-center">Loading properties...</div>;
  }

  if (error || !data) {
    return <div className="p-10 text-center">Failed to load properties</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryFilter />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.data.map((property) => (
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
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="text-sm">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>

          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Properties;
