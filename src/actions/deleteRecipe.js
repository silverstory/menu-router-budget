// // rrd import
// import { redirect } from "react-router-dom";

// // library
// import { toast } from "react-toastify";

// // helpers
// import { deleteItem, getAllMatchingItems } from "../helpers";

// export function deleteRecipe({ params }) {
//   try {
//     deleteItem({
//       key: "recipes",
//       id: params.id,
//     });

//     const associatedIngredients = getAllMatchingItems({
//       category: "ingredients",
//       key: "recipeId",
//       value: params.id,
//     });

//     associatedIngredients.forEach((ingredient) => {
//       deleteItem({
//         key: "ingredients",
//         id: ingredient.id,
//       });
//     });

//     toast.success("Recipe deleted successfully!");
//   } catch (e) {
//     throw new Error("There was a problem deleting your recipe.");
//   }
//   return redirect("/");
// }
