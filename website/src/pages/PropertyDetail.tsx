import { useParams, useNavigate } from "react-router-dom";
import { properties } from "@/data/properties";
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
import { toast } from "sonner";

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

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === Number(id));
  const [isLiked, setIsLiked] = useState(false);

  if (!property) {
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

  const handleReserve = () => {
    navigate(`/booking/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-foreground" />
              <span className="font-semibold">{property.rating}</span>
              <span className="text-muted-foreground">
                · {property.host.reviews} reviews
              </span>
            </div>
            {property.isSuperhost && (
              <span className="badge-superhost">Superhost</span>
            )}
            <span className="text-muted-foreground underline cursor-pointer">
              {property.location}
            </span>
            <div className="flex gap-4 ml-auto">
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-lg transition-colors">
                <Share className="h-4 w-4" />
                <span className="underline font-medium">Share</span>
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2 hover:bg-secondary p-2 rounded-lg transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-primary text-primary" : ""
                  }`}
                />
                <span className="underline font-medium">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8">
          <div className="aspect-square md:aspect-auto md:row-span-2">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover aspect-square hover:opacity-95 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-8 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Entire place hosted by {property.host.name}
                </h2>
                <p className="text-muted-foreground">
                  {property.maxGuests} guests · {property.bedrooms} bedroom
                  {property.bedrooms > 1 ? "s" : ""} · {property.bathrooms} bath
                  {property.bathrooms > 1 ? "s" : ""}
                </p>
              </div>
              <img
                src={property.host.image}
                alt={property.host.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>

            {/* Features */}
            <div className="space-y-6 pb-8 border-b border-border">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Self check-in</h3>
                  <p className="text-muted-foreground text-sm">
                    Check yourself in with the lockbox.
                  </p>
                </div>
              </div>
              {property.isSuperhost && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {property.host.name} is a Superhost
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Superhosts are experienced, highly rated hosts.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Free cancellation for 48 hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Get a full refund if you change your mind.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-border">
              <p className="text-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="pb-8 border-b border-border">
              <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-4">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-xl border border-border shadow-card-hover p-6">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold">${property.price}</span>
                  <span className="text-muted-foreground"> night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-foreground" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-muted-foreground">
                    · {property.host.reviews} reviews
                  </span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="border border-border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b border-border">
                    <p className="text-xs font-semibold uppercase">Check-in</p>
                    <p className="text-muted-foreground">Add date</p>
                  </div>
                  <div className="p-3 border-b border-border">
                    <p className="text-xs font-semibold uppercase">Checkout</p>
                    <p className="text-muted-foreground">Add date</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase">Guests</p>
                  <p className="text-muted-foreground">1 guest</p>
                </div>
              </div>

              <button onClick={handleReserve} className="btn-coral w-full mb-4">
                Reserve
              </button>

              <p className="text-center text-sm text-muted-foreground mb-4">
                You won't be charged yet
              </p>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="underline">${property.price} x 5 nights</span>
                  <span>${property.price * 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>$75</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>$120</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-border font-semibold">
                  <span>Total before taxes</span>
                  <span>${property.price * 5 + 75 + 120}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;