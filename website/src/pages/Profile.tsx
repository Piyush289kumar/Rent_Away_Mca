import Header from "@/components/Header";
import {
  User,
  Shield,
  Star,
  MessageCircle,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { properties } from "@/data/properties";

const Profile = () => {
  const userBookings = properties.slice(0, 2);

  const menuItems = [
    { icon: User, label: "Personal info", description: "Provide personal details" },
    { icon: Shield, label: "Login & security", description: "Update your password" },
    { icon: CreditCard, label: "Payments & payouts", description: "Review payments" },
    { icon: Bell, label: "Notifications", description: "Notification preferences" },
    { icon: Settings, label: "Privacy & sharing", description: "Manage your data" },
    { icon: HelpCircle, label: "Get help", description: "Help Center" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 sticky top-28 animate-fade-in">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 bg-foreground text-background p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-center mb-1">John Doe</h1>
              <p className="text-muted-foreground text-center mb-4">Guest</p>

              <div className="flex items-center justify-center gap-6 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Years hosting</p>
                </div>
              </div>

              {/* Verified Info */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold mb-3">Confirmed information</h3>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span>Identity verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span>Email address</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span>Phone number</span>
                </div>
              </div>

              {/* Logout */}
              <button className="mt-6 w-full flex items-center justify-center gap-2 text-primary font-medium py-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Account Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-card transition-shadow text-left"
                  >
                    <div className="p-3 bg-coral-light rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>

            {/* Upcoming Trips */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your trips</h2>
                <Link
                  to="/properties"
                  className="text-primary font-medium hover:underline"
                >
                  Explore all
                </Link>
              </div>

              {userBookings.length > 0 ? (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-card transition-shadow"
                    >
                      <img
                        src={booking.images[0]}
                        alt={booking.title}
                        className="w-24 h-24 md:w-32 md:h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{booking.title}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {booking.location}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-coral-light text-primary rounded-md font-medium">
                            Upcoming
                          </span>
                          <span className="text-muted-foreground">
                            Mar 1-6, 2025
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${booking.price * 5}</p>
                        <p className="text-sm text-muted-foreground">5 nights</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No trips booked... yet!
                  </p>
                  <Link to="/properties" className="btn-coral inline-block">
                    Start exploring
                  </Link>
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <button className="text-primary font-medium hover:underline">
                  Show all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                      alt="Sarah"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">Sarah</p>
                      <p className="text-xs text-muted-foreground">March 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "John was an amazing guest! Very respectful of the property
                    and left everything spotless. Would definitely host again."
                  </p>
                </div>

                <div className="p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                      alt="Michael"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">Michael</p>
                      <p className="text-xs text-muted-foreground">
                        February 2024
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Great communication throughout. John followed all house rules
                    and was a pleasure to host."
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;