import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Star,
  Heart,
  Share,
  Wifi,
  Car,
  Waves,
  Snowflake,
  Utensils,
  Flame,
  Mountain,
  TreePine,
  Check,
} from "lucide-react";
import { useState } from "react";
import { usePropertyById } from "@/api/property.api";

const amenityIcons: Record<string, React.ElementType> = {
  Wifi: Wifi,
  "Free parking": Car,
  Pool: Waves,
  "Air conditioning": Snowflake,
  Kitchen: Utensils,
  "Hot tub": Flame,
  "Mountain view": Mountain,
  "Lake view": TreePine,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePropertyById(id);
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return <div className="p-10 text-center">Loading property...</div>;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <button onClick={() => navigate("/properties")} className="btn-coral">
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const property = data.data;

  const images = property.gallery?.length
    ? property.gallery
    : property.coverImage
      ? [property.coverImage]
      : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-10">
        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="flex items-center gap-4 text-sm mt-2">
            <Star className="h-4 w-4 fill-foreground" />
            <span>{property.rating?.avg || 0}</span>
            <span className="text-muted-foreground">
              · {property.propertyType}
            </span>

            <div className="ml-auto flex gap-4">
              <button className="flex items-center gap-2">
                <Share className="h-4 w-4" /> Share
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-primary text-primary" : ""
                  }`}
                />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="rounded-md">
          {images[0] && (
            <img
              src={images[0]}
              className="w-full h-full object-cover md:row-span-2 rounded-lg"
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold">
                Hosted by {property.host?.name}
              </h2>
              <p className="text-muted-foreground">
                {property.guests} guests · {property.bedrooms} bedrooms ·{" "}
                {property.bathrooms} bathrooms
              </p>

              {/* HOUSE RULES */}
              {property.houseRules && (
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      property.houseRules.smoking
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    🚭 Smoking{" "}
                    {property.houseRules.smoking ? "Allowed" : "Not allowed"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full border ${
                      property.houseRules.pets
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    🐶 Pets{" "}
                    {property.houseRules.pets ? "Allowed" : "Not allowed"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full border ${
                      property.houseRules.parties
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    🎉 Parties{" "}
                    {property.houseRules.parties ? "Allowed" : "Not allowed"}
                  </span>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />

            {/* AMENITIES */}
            {property.amenities?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  What this place offers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity: string) => {
                    const Icon = amenityIcons[amenity] || Check;
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT (BOOKING CARD) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="border rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  ₹{property.pricing?.perNight}
                </span>
                <span className="text-muted-foreground">per night</span>
              </div>

              <button
                onClick={() => navigate(`/booking/${property._id}`)}
                className="btn-coral w-full"
              >
                Reserve
              </button>

              <p className="text-xs text-center text-muted-foreground">
                You won’t be charged yet
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
