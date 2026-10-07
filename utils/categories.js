// Single source of truth for listing categories.
// Model enum, Joi validation, filter bar and the new/edit forms all use this list.
const CATEGORIES = [
  { value: "trending", label: "Trending", icon: "fa-solid fa-fire" },
  { value: "rooms", label: "Rooms", icon: "fa-solid fa-hotel" },
  { value: "iconic-cities", label: "Iconic cities", icon: "fa-solid fa-building-columns" },
  { value: "mountains", label: "Mountains", icon: "fa-solid fa-mountain-sun" },
  { value: "castles", label: "Castles", icon: "fa-brands fa-fort-awesome" },
  { value: "pool", label: "Amazing pool", icon: "fa-solid fa-person-swimming" },
  { value: "camping", label: "Camping", icon: "fa-solid fa-campground" },
  { value: "farms", label: "Farms", icon: "fa-solid fa-tractor" },
  { value: "arctic", label: "Arctic", icon: "fa-solid fa-snowflake" },
  { value: "islands", label: "Islands", icon: "fa-solid fa-earth-oceania" },
  { value: "domes", label: "Domes", icon: "fa-solid fa-igloo" },
  { value: "boats", label: "Boats", icon: "fa-solid fa-sailboat" },
];

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

module.exports = { CATEGORIES, CATEGORY_VALUES };
