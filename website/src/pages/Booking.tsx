import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import Header from "@/components/Header";
import { usePropertyById } from "@/api/property.api";
import { useCreateBooking } from "@/api/booking.api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ----------------------------------
     DATA
  ---------------------------------- */
  const { data, isLoading } = usePropertyById(id);
  const property = data?.data;

  const { mutate: createBooking, isPending } = useCreateBooking();

  /* ----------------------------------
     FORM STATE
  ---------------------------------- */
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  /* ----------------------------------
     CALCULATIONS
  ---------------------------------- */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(
      Math.ceil((+end - +start) / (1000 * 60 * 60 * 24)),
      0
    );
  }, [checkIn, checkOut]);

  const subtotal = nights * (property?.pricing?.perNight || 0);
  const cleaningFee = property?.pricing?.cleaningFee || 0;
  const serviceFee = property?.pricing?.serviceFee || 0;
  const total = subtotal + cleaningFee + serviceFee;

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    createBooking(
      {
        propertyId: property._id,
        checkIn,
        checkOut,
        totalGuests: guests,
      },
      {
        onSuccess: () => {
          toast.success("Booking request sent!");
          navigate("/profile");
        },
        onError: (err: unknown) => {
          toast.error(err.message || "Booking failed");
        },
      }
    );
  };

  /* ----------------------------------
     STATES
  ---------------------------------- */
  if (isLoading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading booking...
      </div>
    );
  }

  /* ----------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* BACK */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Confirm your booking</h1>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* GUESTS */}
          <div>
            <label className="text-xs font-semibold uppercase">Guests</label>
            <input
              type="number"
              min={1}
              max={property.guests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="input-field"
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={isPending || nights === 0}
            onClick={handleBooking}
            className="btn-coral w-full mt-6 disabled:opacity-60"
          >
            {isPending ? "Booking..." : `Request booking · ₹${total}`}
          </button>

          <p className="text-xs text-muted-foreground">
            You won’t be charged yet
          </p>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-card border rounded-xl p-6 space-y-4 sticky top-6">
            <div className="flex gap-4">
              <img
                src={property.coverImage}
                alt={property.title}
                className="w-28 h-20 object-cover rounded-lg"
              />

              <div>
                <p className="font-medium line-clamp-2">{property.title}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-foreground" />
                  {property.rating?.avg || 0}
                </div>
              </div>
            </div>

            {/* PRICE */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>₹{property.pricing.perNight} × {nights} nights</span>
                <span>₹{subtotal}</span>
              </div>

              {cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>₹{cleaningFee}</span>
                </div>
              )}

              {serviceFee > 0 && (
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{serviceFee}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold border-t pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="flex gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              Secure booking protected by system
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
