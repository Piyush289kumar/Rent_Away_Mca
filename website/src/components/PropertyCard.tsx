import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface PropertyCardProps {
  id: number;
  images: string[];
  location: string;
  distance: string;
  dates: string;
  price: number;
  rating: number;
  isSuperhost?: boolean;
}

const PropertyCard = ({
  id,
  images,
  location,
  distance,
  dates,
  price,
  rating,
  isSuperhost,
}: PropertyCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link to={`/property/${id}`} className="group block">
      <div className="property-card">
        {/* Image Carousel */}
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <img
            src={images[currentImage]}
            alt={location}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 z-10"
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                isLiked
                  ? "fill-primary text-primary"
                  : "fill-black/30 text-white stroke-2"
              }`}
            />
          </button>

          {/* Superhost Badge */}
          {isSuperhost && (
            <div className="absolute top-3 left-3 badge-superhost">
              Superhost
            </div>
          )}

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImage(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentImage === idx
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-1 pt-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground">{location}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-foreground" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{distance}</p>
          <p className="text-muted-foreground text-sm">{dates}</p>
          <p className="mt-2">
            <span className="font-semibold">${price}</span>{" "}
            <span className="text-muted-foreground">night</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;