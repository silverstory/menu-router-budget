export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

export const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

// colors
const generateRandomColor = () => {
  const existingRecipeLength = fetchData("recipes")?.length ?? 0;
  return `${existingRecipeLength * 34} 65% 50%`;
};

// colors
const generateRandomRecipeGroupColor = () => {
  const existingRecipeGroupLength = fetchData("recipegroups")?.length ?? 0;
  return `${existingRecipeGroupLength * 34} 65% 50%`;
};

// Recipe Categories
export const categories = [
  {
    name: "Breakfast recipes",
    image: "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 1,
  },
  {
    name: "Lunch recipes",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&dpr=1",
    id: 2,
  },
  {
    name: "Dinner recipes",
    image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 3,
  },
  {
    name: "Appetizer recipes",
    image: "https://images.pexels.com/photos/39826/chunks-wreak-menu-gastronomy-39826.jpeg?auto=compress&cs=tinysrgb&w=640&h=403&dpr=1",
    id: 4,
  },
  {
    name: "Salad recipes",
    image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&dpr=1",
    id: 5,
  },
  {
    name: "Main-course recipes",
    image: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 6,
  },
  {
    name: "Side-dish recipes",
    image: "https://images.pexels.com/photos/8827916/pexels-photo-8827916.jpeg?auto=compress&cs=tinysrgb&w=640&h=424&dpr=1",
    id: 7,
  },
  {
    name: "Baked-goods recipes",
    image: "https://images.pexels.com/photos/1397292/pexels-photo-1397292.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 8,
  },
  {
    name: "Dessert recipes",
    image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=640&h=373&dpr=1",
    id: 9,
  },
  {
    name: "Snack recipes",
    image: "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 10,
  },
  {
    name: "Soup recipes",
    image: "https://images.pexels.com/photos/1406501/pexels-photo-1406501.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 11,
  },
  {
    name: "Holiday recipes",
    image: "https://images.pexels.com/photos/5876742/pexels-photo-5876742.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 12,
  },
  {
    name: "Vegetarian Dishes",
    image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 13,
  },
  {
    name: "Beverages",
    image: "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1",
    id: 14,
  },
];

// https://images.pexels.com/photos/4113138/pexels-photo-4113138.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=1

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

// create recipegroup
export const createRecipeGroup = ({
  name,
  updatedby,
}) => {
  // const newItem = {
  //   id: crypto.randomUUID(),
  //   name: name,
  //   createdAt: Date.now(),
  //   updatedby: updatedby,
  //   color: generateRandomRecipeGroupColor(),
  // };
  // const existingRecipeGroups = fetchData("recipegroups") ?? [];
  // return localStorage.setItem(
  //   "recipegroups",
  //   JSON.stringify([...existingRecipeGroups, newItem])
  // );
};

// create recipe
export const createRecipe = ({ name, amount, createdBy, serving, instruction, cookingtime, recipegroupId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    createdBy: createdBy,
    serving: serving,
    instruction: instruction,
    cookingtime: +cookingtime,
    recipegroupId: recipegroupId,
    color: generateRandomColor(),
  };
  const existingRecipes = fetchData("recipes") ?? [];
  return localStorage.setItem(
    "recipes",
    JSON.stringify([...existingRecipes, newItem])
  );
};

// create ingredient
export const createIngredient = ({ name, amount, unit, price, createdBy, recipeId, ingredientSqlId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    unit: unit,
    price: +price,
    createdBy: createdBy,
    recipeId: recipeId,
    ingredientSqlId: ingredientSqlId,
  };
  const existingIngredients = fetchData("ingredients") ?? [];
  return localStorage.setItem(
    "ingredients",
    JSON.stringify([...existingIngredients, newItem])
  );
};

// total spent by recipe
export const calculateSpentByRecipe = (recipeId) => {
  const ingredients = fetchData("ingredients") ?? [];
  const recipeSpent = ingredients.reduce((acc, ingredient) => {
    // check if ingredient.id === recipeId I passed in
    if (ingredient.recipeId !== recipeId) return acc;

    // add the current amount to my total
    return (acc += ingredient.amount);
  }, 0);
  return recipeSpent;
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
  });
};
