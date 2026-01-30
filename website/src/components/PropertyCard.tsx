import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  images: string[];
  title: string;
  distance: string;
  guests: number;
  price: number;
  rating: number;
  isSuperhost?: string;
}

const PropertyCard = ({
  id,
  images,
  title,
  distance,
  guests,
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
            alt={title}
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
            <div className="absolute top-3 left-3 badge-superhost bg-red-500 uppercase">
              {isSuperhost}
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
        <div className="p-1 pt-3 px-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-1">
              {/* <Star className="h-4 w-4 fill-foreground" />
              <span className="text-sm">{rating}</span> */}
            </div>
          </div>
          <p className="text-muted-foreground text-sm badge-superhost bg-green-400 text-white uppercase">
            Capicity : {guests}
          </p>
          <div className="mt-5 mb-1 flex justify-between">
            <p>
              <span className="font-semibold">${price}</span>{" "}
              <span className="text-muted-foreground">night</span>
            </p>
            <Link to={`/property/${id}`} className="btn-coral px-2 py-1">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
