// rrd imports
import {
  useRouteError,
  Link,
  useLoaderData,
  useNavigate,
  redirect,
} from "react-router-dom";

// library imports
import { toast } from "react-toastify";
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

// components
import AddIngredientForm from "../components/AddIngredientForm";
import RecipeItem from "../components/RecipeItem";
import Table from "../components/Table";

// helpers
import {
  fetchData,
  waait,
  isObjectEmpty,
  // createIngredient,
  deleteItem,
  getAllMatchingItems,
} from "../helpers";

// components
import Intro from "../components/Intro";

// library imports
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

// loader
export async function recipeLoader({ params }) {
  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const response = await fetch(`${apiUrl}/name`, {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json();
  const isAuth = json.isAuth;
  const userName = await json.userName;
  const user = await json.user;

  // get the recipe

  // const recipe = await getAllMatchingItems({
  //   category: "recipes",
  //   key: "id",
  //   value: params.id,
  // })[0];

  let recipe = {};

  const reciperesponse = await fetch(
    `${apiUrl}/api/sourcerecipes/${params.id}`,
    {
      credentials: "include",
      headers: { Authorization: `Bearer ${user.token}` },
    }
  );

  const recipejson = await reciperesponse.json();

  if (reciperesponse.ok) {
    recipe = recipejson;
  }

  if (!recipe || isObjectEmpty(recipe)) {
    throw new Error("The recipe you’re trying to find doesn’t exist");
  }

  // end get the recipe

  // get the recipegroup

  // const recipegroup = await getAllMatchingItems({
  //   category: "recipegroups",
  //   key: "id",
  //   value: recipe.recipegroupId,
  // })[0];

  let recipegroup = {};

  if (user) {
    // recipegroup
    // const recipegroups = fetchData("recipegroups");

    const recipegroupresponse = await fetch(
      `${apiUrl}/api/sourcerecipegroups/${recipe.recipegroupId}`,
      {
        credentials: "include",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const rcjson = await recipegroupresponse.json();

    if (recipegroupresponse.ok) {
      recipegroup = rcjson;
    }
  }

  // end get the recipegroup

  // get the ingredients

  // const ingredients = await getAllMatchingItems({
  //   category: "ingredients",
  //   key: "recipeId",
  //   value: params.id,
  // });

  // get all ingredients under the current recipe

  let ingredients = [];

  let existingIngredientsLength = 0;
  if (user) {
    const ingredientsresponse = await fetch(
      `${apiUrl}/api/sourceingredients/filter/${recipe._id}`,
      {
        credentials: "include",
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const ingredientsjson = await ingredientsresponse.json();

    if (ingredientsresponse.ok) {
      const _ingredients = await Promise.all(
        ingredientsjson.map(async (_ingredient) => {
          _ingredient.recipeColor = await recipe.color;
          return _ingredient;
        })
      );

      existingIngredientsLength = ingredients.length;
      ingredients.push(..._ingredients);
    }

    // Explanation of the code above versus the code below:
    // 1. Instead of using a for...of loop and finding the index of each _ingredient to update its recipeColor, we can use map to create a new array of _ingredients, where we add the recipeColor property to each _ingredient.
    // 2. We use Promise.all to wait for all the async operations inside the map function to complete, ensuring that the recipe.color is fetched for all _ingredients concurrently.
    // 3. We use push to add all the new _ingredients to the ingredients array, which is more efficient than using the spread operator multiple times.
  }
  // end get all ingredients under the current recipe

  // end get the ingredients

  const sourceIngredients = await fetch(
    `https://my-json-server.typicode.com/silverstory/ingredients/ingredients`
  ).then((response) => response.json());

  return {
    userName,
    user,
    recipe,
    recipegroup,
    ingredients,
    sourceIngredients,
  };
}

// action
export async function recipeAction({ request }) {
  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // get logged-in user
  const response = await fetch(`${apiUrl}/name`, {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json();
  const isAuth = json.isAuth;
  const userName = await json.userName;
  const user = await json.user;

  if (!response.ok) {
    return toast.error(
      `Please log in. The app is unable to retrieve user information. Error message: ${json.error}`
    );
  }
  if (response.ok) {
    // // wag maglagay ng kahit ano dito. bawal.
    // // return toast.success(`You are logged-in ${json.userName}`);
  }
  // end get logged-in user

  // delete recipe

  if (_action === "deleteRecipe") {
    try {
      // check recipe if it contains any ingredients

      // count the ingredients under the current recipe
      let ingredients = [];

      if (user) {
        const ingredientsresponse = await fetch(
          `${apiUrl}/api/sourceingredients/filter/${values.deleteRecipeId}`,
          {
            credentials: "include",
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (ingredientsresponse.ok) {
          const ingredientsjson = await ingredientsresponse.json();
          ingredients.push(...ingredientsjson);
        }
      }

      let existingIngredientsLength = ingredients.length;
      // end count the ingredients under the current recipe

      if (existingIngredientsLength > 0) {
        return toast.error(
          "I'm sorry, I have found existing ingredients for this Recipe. You are not allowed to delete it."
        );
      }
      // end check recipe if it contains any ingredients
      else {
        let recipe = {};

        const reciperesponse = await fetch(
          `${apiUrl}/api/sourcerecipes/${values.deleteRecipeId}`,
          {
            credentials: "include",
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const recipejson = await reciperesponse.json();

        if (!reciperesponse.ok) {
          return toast.error(
            `There was a problem deleting your recipe. ${recipejson.error}`
          );
        }
        if (reciperesponse.ok) {
          recipe = recipejson;
          // return toast.success(`Recipe ${recipe.name} deleted!`);
          toast.success(`Recipe ${recipe.name} deleted!`);
          return redirect(`/recipegroup/${recipe.recipegroupId}`);
        }
      }
    } catch (e) {
      throw new Error("There was a problem deleting your recipe. " + e);
    }
  }

  // end delete recipe

  // create ingredient

  if (_action === "createIngredient") {
    try {
      const newItem = {
        name: values.newIngredient,
        amount: values.newIngredientAmount,
        unit: values.newIngredientUnit,
        price: values.newIngredientPrice,
        createdBy: values.newUserName,
        recipeId: values.newIngredientRecipe,
        recipeName: values.newIngredientRecipeName,
        recipegroupId: values.newIngredientRecipeGroup,
        recipegroupName: values.newIngredientRecipeGroupName,
        ingredientSqlId: values.newIngredientSqlId,
      };

      let ingredient = {};

      const ingredientresponse = await fetch(
        `${apiUrl}/api/sourceingredients/`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify(newItem),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const ingredientjson = await ingredientresponse.json();

      if (!ingredientresponse.ok) {
        return toast.error(
          `There was a problem creating your ingredient. ${ingredientjson.error}`
        );
      }
      if (ingredientresponse.ok) {
        ingredient = ingredientjson;
        return toast.success(`Ingredient ${values.newIngredient} created!`);
      }
    } catch (e) {
      throw new Error("There was a problem creating your ingredient. " + e);
    }
  }

  // end create ingredient

  // delete ingredient

  if (_action === "deleteIngredient") {
    try {
      let ingredient = {};

      const ingredientresponse = await fetch(
        `${apiUrl}/api/sourceingredients/${values.ingredientId}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const ingredientjson = await ingredientresponse.json();

      if (!ingredientresponse.ok) {
        return toast.error(
          `There was a problem deleting your ingredient. ${ingredientjson.error}`
        );
      }
      if (ingredientresponse.ok) {
        ingredient = ingredientjson;
        return toast.success(`Ingredient ${ingredient.name} deleted!`);
      }
    } catch (e) {
      throw new Error("There was a problem deleting your ingredient. " + e);
    }
  }

  // end delete ingredient

  // old
  // if (_action === "createIngredient") {
  //   try {
  //     createIngredient({
  //       name: values.newIngredient,
  //       amount: values.newIngredientAmount,
  //       unit: values.newIngredientUnit,
  //       price: values.newIngredientPrice,
  //       createdBy: values.newUserName,
  //       recipeId: values.newIngredientRecipe,
  //       ingredientSqlId: values.newIngredientSqlId,
  //     });
  //     return toast.success(`Ingredient ${values.newIngredient} created!`);
  //   } catch (e) {
  //     throw new Error("There was a problem creating your ingredient.");
  //   }
  // }

  // if (_action === "deleteIngredient") {
  //   try {
  //     deleteItem({
  //       key: "ingredients",
  //       id: values.ingredientId,
  //     });
  //     return toast.success("Ingredient deleted!");
  //   } catch (e) {
  //     throw new Error("There was a problem deleting your ingredient.");
  //   }
  // }
  // end old
}

const RecipePage = () => {
  const {
    userName,
    user,
    recipe,
    ingredients,
    recipegroup,
    sourceIngredients,
  } = useLoaderData();
  const { usertype } = user;
  const navigate = useNavigate();

  return (
    <>
      {userName ? (
        <div
          className="grid-lg"
          style={{
            "--accent": recipe.color,
          }}
        >
          <div className="flex-md">
            <button className="btn btn--dark" onClick={() => navigate(-1)}>
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
          </div>
          <h1 className="h2">
            <span className="accent">{recipe.name} Recipe</span>
          </h1>
          <h1>
            from{" "}
            <span>
              {recipegroup.name}
              {"."}
            </span>
          </h1>
          <div className="grid-sm">
            <p>
              This page contains all of the ingredients from the recipe{" "}
              <strong>{recipe.name}</strong> under{" "}
              <strong>
                {recipegroup.name}
                {"."}
              </strong>
            </p>
          </div>

          {/* comment button */}
          <div className="grid-sm">
            <span>
              Tap{" "}
              <b>
                <small>"Add Comment"</small>
              </b>{" "}
              button to add comments
            </span>
            <Link to={`/comment/${recipegroup._id}`} className="btn">
              <span>Add Comment</span>
              <ChatBubbleOvalLeftEllipsisIcon width={20} />
            </Link>
          </div>
          {/* end comment button */}

          <div className="flex-lg">
            <RecipeItem recipe={recipe} usertype={usertype} showDelete={true} />
            <AddIngredientForm
              recipes={[recipe]}
              recipegroupId={recipegroup._id}
              recipegroupName={recipegroup.name}
              userName={userName}
              usertype={usertype}
              sourceIngredients={sourceIngredients}
            />
          </div>
          {ingredients && ingredients.length > 0 && (
            <div className="grid-md">
              <h2>
                <span className="accent">{recipe.name}</span> Ingredients
              </h2>
              <Table
                ingredients={ingredients.sort(
                  (a, b) => b.createdAt - a.createdAt
                )}
                user={user}
                showRecipe={false}
              />
            </div>
          )}
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default RecipePage;
