import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/api/property.api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Properties = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const [params] = useSearchParams();
  const search = params.get("search") || "";

  const { data, isLoading, error } = useProperties(page, limit, search);

  console.log('search', data);
  
  // reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (isLoading) {
    return <div className="p-10 text-center">Loading properties...</div>;
  }

  if (error || !data) {
    return <div className="p-10 text-center">Failed to load properties</div>;
  }

  const properties = data.data ?? [];
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

      {search && (
        <p className="text-sm text-muted-foreground flex justify-center py-5">
          Showing results for{" "}
          <span className="font-semibold text-foreground">"{search}"</span>
        </p>
      )}

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">
              No properties found for "{search}"
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
