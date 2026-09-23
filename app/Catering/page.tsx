import { getSettings } from "@/lib/utils/settings";
import { Utensils, Clock, Users, Truck } from "lucide-react";

export default async function CateringPage() {
  const settings = await getSettings();

  // Catering Menu items matching the structure from the reference site
  const cateringMenu = [
    {
      category: "Main Courses",
      items: [
        { name: "Dried Palava Sauce", price15: "$150", price30: "$300" },
        { name: "Cassava Leaves", price15: "$150", price30: "$300" },
        { name: "Chuck Rice Gravy", price15: "$142", price30: "$284" },
        { name: "Groundnut Stew", price15: "$175", price30: "$350" },
      ],
    },
    {
      category: "Single Dishes",
      items: [
        { name: "Roasted Chicken", price15: "$96", price30: "$192" },
        { name: "Fried Fish", price15: "$156", price30: "$312" },
        { name: "Roasted Goat Shank", price15: "$285", price30: "$570" },
        { name: "Roasted Beef Skewers", price15: "$146", price30: "$292" },
        { name: "Kidney Beans", price15: "$85", price30: "$170" },
        { name: "Collard Greens", price15: "$85", price30: "$170" },
        { name: "Potato Greens", price15: "$85", price30: "$170" },
      ],
    },
    {
      category: "Appetizers",
      items: [
        { name: "Pepper Kala", price15: "$75", price30: "$150" },
        { name: "Roasted Chicken Wings", price15: "$120", price30: "$240" },
        { name: "Roasted Garlic Shrimp", price15: "$124", price30: "$248" },
      ],
    },
    {
      category: "Sides & Desserts",
      items: [
        { name: "Jollof Rice", price15: "$58", price30: "$115" },
        { name: "Fried Plantains", price15: "$46", price30: "$92" },
        { name: "White Rice / Country Dry Rice", price15: "$46", price30: "$92" },
        { name: "Rice Bread", price15: "$85", price30: "$170" },
      ],
    },
  ];

  return (
    <div className="container-mawa py-16 max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Utensils size={44} className="mx-auto text-mawa-gold mb-4" />
        <h1 className="section-heading mb-4">MaWa Catering & Events</h1>
        <p className="text-mawa-black/80 text-lg leading-relaxed mb-6">
          Bring the authentic taste of MaWa to your next gathering. Whether you are hosting an intimate celebration, a corporate event, or a large family gathering, our catering options are thoughtfully crafted for every occasion.
        </p>

        {/* Primary CTA */}
        {settings.cateringUrl ? (
          <a
            href={settings.cateringUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block py-3 px-8 text-base font-semibold"
          >
            {settings.cateringButtonText || "Submit Catering Request"}
          </a>
        ) : (
          <a
            href="#catering-menu"
            className="btn-primary inline-block py-3 px-8 text-base font-semibold"
          >
            Explore Catering Menu
          </a>
        )}
      </div>

      {/* Highlights / Important Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-center">
        <div className="p-6 rounded-2xl bg-white border border-mawa-gold/20 shadow-sm">
          <Users size={28} className="mx-auto text-mawa-gold mb-2" />
          <h3 className="font-semibold text-mawa-black mb-1">Group Sizes</h3>
          <p className="text-sm text-mawa-black/70">Available for groups of 15 or more guests</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-mawa-gold/20 shadow-sm">
          <Clock size={28} className="mx-auto text-mawa-gold mb-2" />
          <h3 className="font-semibold text-mawa-black mb-1">Advance Notice</h3>
          <p className="text-sm text-mawa-black/70">Please place orders at least 1–3 days in advance</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-mawa-gold/20 shadow-sm">
          <Truck size={28} className="mx-auto text-mawa-gold mb-2" />
          <h3 className="font-semibold text-mawa-black mb-1">Delivery & Pickup</h3>
          <p className="text-sm text-mawa-black/70">Flexible options available for your venue location</p>
        </div>
      </div>

      {/* Catering Menu Display */}
      <div id="catering-menu" className="space-y-12">
        <div className="border-b border-mawa-gold/30 pb-4 text-center">
          <h2 className="text-2xl font-bold text-mawa-black">Catering Menu</h2>
          <p className="text-sm text-mawa-black/60 mt-1">Select half-pan (15 servings) or full-pan (30 servings) portions</p>
        </div>

        {cateringMenu.map((section, idx) => (
          <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-mawa-gold/20 shadow-sm">
            <h3 className="text-xl font-bold text-mawa-gold mb-6 border-b border-gray-100 pb-2">
              {section.category}
            </h3>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="font-medium text-mawa-black text-base">{item.name}</span>
                  <div className="flex gap-4 text-sm font-semibold text-mawa-black/80">
                    <span className="bg-mawa-gold/10 px-3 py-1 rounded-full">
                      15 Servings: {item.price15}
                    </span>
                    <span className="bg-mawa-gold/10 px-3 py-1 rounded-full">
                      30 Servings: {item.price30}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}