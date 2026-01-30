import { useParams, useNavigate, Link } from "react-router-dom";
import { properties } from "@/data/properties";
import { ArrowLeft, Star, CreditCard, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === Number(id));
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    country: "United States",
  });

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <button onClick={() => navigate("/properties")} className="btn-coral">
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  const nights = 5;
  const subtotal = property.price * nights;
  const cleaningFee = 75;
  const serviceFee = 120;
  const total = subtotal + cleaningFee + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Booking confirmed! Check your email for details.");
    setIsProcessing(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Request to book</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="space-y-8 animate-fade-in">
            {/* Trip Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Your trip</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-muted-foreground">Mar 1-6, 2025</p>
                  </div>
                  <button className="underline font-medium">Edit</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-muted-foreground">2 guests</p>
                  </div>
                  <button className="underline font-medium">Edit</button>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Payment Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pay with</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card Selection */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="w-10 h-6 bg-secondary rounded"></div>
                    <div className="w-10 h-6 bg-secondary rounded"></div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border-b border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <div className="grid grid-cols-2">
                    <input
                      type="text"
                      placeholder="Expiration"
                      value={formData.expiry}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry: e.target.value })
                      }
                      className="px-4 py-3 border-r border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      className="px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Name */}
                <input
                  type="text"
                  placeholder="Name on card"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  required
                />

                {/* Country */}
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>

                <hr className="border-border my-6" />

                {/* Cancellation Policy */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Cancellation policy
                  </h2>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Free cancellation for 48 hours.
                    </strong>{" "}
                    Cancel before Feb 28 for a partial refund.{" "}
                    <button className="underline font-medium text-foreground">
                      Learn more
                    </button>
                  </p>
                </div>

                <hr className="border-border my-6" />

                {/* Ground Rules */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ground rules</h2>
                  <p className="text-muted-foreground mb-3">
                    We ask every guest to remember a few simple things about what
                    makes a great guest.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Follow the house rules</li>
                    <li>• Treat your Host's home like your own</li>
                  </ul>
                </div>

                <hr className="border-border my-6" />

                {/* Terms */}
                <p className="text-xs text-muted-foreground">
                  By selecting the button below, I agree to the Host's House
                  Rules, Ground rules for guests, Airbnb's Rebooking and Refund
                  Policy, and that Airbnb can charge my payment method if I'm
                  responsible for damage.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-coral w-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Confirm and pay · $${total}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:pl-12 animate-fade-in">
            <div className="sticky top-8 bg-card rounded-xl border border-border p-6">
              {/* Property Preview */}
              <div className="flex gap-4 pb-6 border-b border-border">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Entire home</p>
                    <p className="font-medium line-clamp-2">{property.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-foreground" />
                    <span>{property.rating}</span>
                    <span className="text-muted-foreground">
                      ({property.host.reviews})
                    </span>
                    {property.isSuperhost && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="badge-superhost text-[10px] px-1">
                          Superhost
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="py-6 border-b border-border">
                <h3 className="text-lg font-semibold mb-4">Price details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="underline">
                      ${property.price} x {nights} nights
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 flex justify-between font-semibold text-lg">
                <span>Total (USD)</span>
                <span>${total}</span>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-coral-light rounded-lg flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your payment is protected by industry-leading security
                  measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;