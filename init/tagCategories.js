// Ek baar chalao: node init/tagCategories.js
// Jin listings me category nahi hai unhe title/description ke keywords se category deta hai.
// Jo match nahi hoti unki list print hoti hai, unhe Edit page se manually set kar do.
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

// Order important hai: pehla match jeetta hai
const RULES = [
  ["castles", ["castle", "palace", "fort"]],
  ["arctic", ["arctic", "igloo", "snow", "glacier"]],
  ["domes", ["dome"]],
  ["boats", ["houseboat", "boat", "yacht", "sailing"]],
  ["islands", ["island", "maldives"]],
  ["pool", ["pool", "infinity"]],
  ["farms", ["farm", "ranch", "barn", "vineyard"]],
  ["mountains", ["mountain", "ski", "chalet", "alps", "hill"]],
  ["camping", ["camp", "tent", "treehouse", "cabin", "safari"]],
  ["iconic-cities", ["loft", "penthouse", "apartment", "brownstone", "downtown", "city", "canal"]],
  ["rooms", ["cottage", "bungalow", "villa", "house", "room", "beach"]],
];

const pickCategory = (listing) => {
  const text = `${listing.title} ${listing.description || ""}`.toLowerCase();
  for (const [category, words] of RULES) {
    if (words.some((w) => text.includes(w))) return category;
  }
  return null;
};

(async () => {
  await mongoose.connect(mongo_url);
  const untagged = await Listing.find({
    $or: [{ category: { $exists: false } }, { category: null }, { category: "" }],
  });

  let tagged = 0;
  const skipped = [];
  for (const listing of untagged) {
    const category = pickCategory(listing);
    if (!category) {
      skipped.push(listing.title);
      continue;
    }
    // updateOne: purani listings me geometry na ho to bhi save fail na ho
    await Listing.updateOne({ _id: listing._id }, { $set: { category } });
    console.log(`${listing.title}  ->  ${category}`);
    tagged++;
  }

  console.log(`\nTagged: ${tagged}, Skipped: ${skipped.length}`);
  skipped.forEach((t) => console.log("  manual category chahiye:", t));
  await mongoose.disconnect();
})();
