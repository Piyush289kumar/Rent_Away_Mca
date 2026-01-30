import { useState } from "react";
import {
  Home,
  Waves,
  Mountain,
  TreePine,
  Building,
  Tent,
  Castle,
  Warehouse,
  Ship,
  Flame,
} from "lucide-react";

const categories = [
  { icon: Home, label: "Rooms" },
  { icon: Waves, label: "Beachfront" },
  { icon: Mountain, label: "Amazing views" },
  { icon: TreePine, label: "Cabins" },
  { icon: Building, label: "OMG!" },
  { icon: Tent, label: "Camping" },
  { icon: Castle, label: "Castles" },
  { icon: Warehouse, label: "Barns" },
  { icon: Ship, label: "Houseboats" },
  { icon: Flame, label: "Trending" },
];

const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Rooms");

  return (
    <div className="border-b border-border bg-background sticky top-20 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
          {categories.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all ${
                activeCategory === label
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium whitespace-nowrap">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;