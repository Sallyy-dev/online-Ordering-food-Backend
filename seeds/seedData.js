const Category = require("../models/category");

const menuData = [
  {
    name: "Margerita",
    type: "Pizzas",
    description: "Claasic pizza",
    items: [
      { name: "small", price: 25, description: "small piza" },
      { name: "medium", price: 40, description: "30 سم" },
      { name: "large", price: 55, description: "40 سم" },
    ],
  },
  {
    name: "piproney",
    type: "Pizzas",
    description: "بيتزا بالبيبروني والجبن",
    items: [
      { name: "صغيرة", price: 30, description: "20 سم" },
      { name: "متوسطة", price: 45, description: "30 سم" },
      { name: "كبيرة", price: 60, description: "40 سم" },
    ],
  },
  {
    name: "خبز ثوم",
    type: "Garlic Bread",
    description: "خبز بالثوم والزبد",
    items: [
      { name: "4 قطع", price: 10 },
      { name: "8 قطع", price: 18 },
    ],
  },
];

const seedInitialData = async () => {
  try {
    await Category.deleteMany({});
    await Category.insertMany(menuData);
    console.log("Successfully");
  } catch (error) {
    console.error("Error", error.message);
  }
};

    console.log("Data Imported Successfully!");

module.exports = seedInitialData;
