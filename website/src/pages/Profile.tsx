import Header from "@/components/Header";
import {
  User as UserIcon,
  Shield,
  Star,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Camera,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMe, useMyBookings, useLogout } from "@/api/user.api";

const Profile = () => {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useMe();
  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { mutate: logout } = useLogout();

  if (userLoading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const menuItems = [
    { icon: UserIcon, label: "Personal info", description: "Provide personal details" },
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

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-28">

              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    {initials}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-foreground text-background p-2 rounded-full">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-center">
                {user?.name}
              </h1>
              <p className="text-muted-foreground text-center capitalize">
                {user?.role}
              </p>

              {/* Verified */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Confirmed information</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  Email verified
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  logout(undefined, {
                    onSuccess: () => navigate("/login"),
                  });
                }}
                className="mt-6 w-full flex items-center justify-center gap-2 text-primary font-medium py-3 border rounded-lg hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ACCOUNT */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:shadow transition"
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

            {/* BOOKINGS */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Your trips</h2>

              {bookingsLoading ? (
                <p>Loading trips...</p>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex gap-4 p-4 bg-card rounded-xl border"
                    >
                      <img
                        src={booking.property.coverImage}
                        className="w-28 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          {booking.property.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-coral-light text-primary capitalize">
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{booking.pricing.total}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.nights} nights
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card p-8 rounded-xl text-center border">
                  <p className="mb-4 text-muted-foreground">
                    No trips booked yet
                  </p>
                  <Link to="/properties" className="btn-coral">
                    Start exploring
                  </Link>
                </div>
              )}
            </section>

            {/* REVIEWS (STATIC FOR NOW) */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="p-4 bg-card rounded-xl border">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-foreground" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Reviews system coming soon ✨
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
