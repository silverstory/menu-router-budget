// rrd imports
import {
  Form,
  useRouteError,
  Link,
  useLoaderData,
  useNavigate,
  useFetcher,
  redirect,
} from "react-router-dom";

// library imports
import { toast } from "react-toastify";
import {
  BanknotesIcon,
  TrashIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  ArrowUturnLeftIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

// components
import Intro from "../components/Intro";
import AddRecipeForm from "../components/AddRecipeForm";
import AddIngredientForm from "../components/AddIngredientForm";
import RecipeItem from "../components/RecipeItem";
import Table from "../components/Table";

//  helpers
import {
  // createRecipe,
  // createIngredient,
  deleteItem,
  fetchData,
  waait,
  isObjectEmpty,
  getAllMatchingItems,
} from "../helpers";

// loader
export async function recipegroupMenuLoader({ params }) {
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

  // get one recipegroup

  // const recipegroup = await getAllMatchingItems({
  //   category: "recipegroups",
  //   key: "_id",
  //   value: params.id,
  // })[0];

  let recipegroup = {};

  const recipegroupresponse = await fetch(
    `${apiUrl}/api/sourcerecipegroups/${params.id}`,
    {
      credentials: "include",
      headers: { Authorization: `Bearer ${user.token}` },
    }
  );

  const rcjson = await recipegroupresponse.json();

  if (recipegroupresponse.ok) {
    recipegroup = rcjson;
  }

  if (!recipegroup || isObjectEmpty(recipegroup)) {
    throw new Error("The recipe category you’re trying to find doesn’t exist");
  }


  // end get one recipegroup

  // get all recipes under the current recipegroup

  // const recipes = await getAllMatchingItems({
  //   category: "recipes",
  //   key: "recipegroupId",
  //   value: recipegroup._id,
  // });

  let recipes = [];
  let existingRecipesLength = 0;
  if (user) {
    const recipesresponse = await fetch(
      `${apiUrl}/api/sourcerecipes/filter/${params.id}`,
      {
        credentials: "include",
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const recipesjson = await recipesresponse.json();
    if (recipesresponse.ok) {
      recipes = recipesjson;
      existingRecipesLength = recipes.length;
    }
  }

  // end get all recipes under the current recipegroup

  // do not use for loop with async / await
  // use one if this instead

  // await Promise.all(players.map(async (player) => {
  //   await givePrizeToPlayer(player);
  // }));

  // airbnb uses this, so use this one.
  // await players.reduce(async (a, player) => {
  //   // Wait for the previous item to finish processing
  //   await a;
  //   // Process this item
  //   await givePrizeToPlayer(player);
  // }, Promise.resolve());

  // get all ingredients under the current recipe

  let ingredients = [];

  await recipes.reduce(async (a, recipe) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
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

      // old code
      // const ingredientsjson = await ingredientsresponse.json();
      // if (ingredientsresponse.ok) {
      //   _ingredients = await ingredientsjson;
      //   // add recipeColor
      //   for (const _ingredient of _ingredients) {
      //     const index = _ingredients.findIndex((obj) => {
      //       return obj._id === _ingredient._id;
      //     });
      //     // console.log(index); // 👉️ 1

      //     _ingredients[index].recipeColor = await recipe.color;
      //     console.log({ ingreColor: _ingredients[index].recipeColor });
      //   }
      //   // end add recipe color
      //   existingIngredientsLength = ingredients.length;
      //   ingredients = [...ingredients, ..._ingredients];
      // }
    }
  }, Promise.resolve());
  // end get all ingredients under the current recipe

  // old
  // recipes.forEach( async (recipe) => {
  //   // const _ingredients = getAllMatchingItems({
  //   //   category: "ingredients",
  //   //   key: "recipeId",
  //   //   value: recipe._id,
  //   // });
  // });

  const sourceIngredients = await fetch(
    `https://my-json-server.typicode.com/silverstory/ingredients/ingredients`
  ).then((response) => response.json());

  return {
    recipegroup,
    userName,
    user,
    recipes,
    ingredients,
    sourceIngredients,
  };
}

// action
export async function recipegroupMenuAction({ request }) {
  await waait();

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

  // // new user submission
  // if (_action === "newUser") {
  //   try {
  //     localStorage.setItem("userName", JSON.stringify(values.userName));
  //     return toast.success(`Welcome, ${values.userName}`);
  //   } catch (e) {
  //     throw new Error("There was a problem creating your account.");
  //   }
  // }

  // create recipe

  if (_action === "createRecipe") {
    try {
      // generate random Color
      let recipes = [];
      let existingRecipesLength = 0;
      if (user) {
        const recipesresponse = await fetch(
          `${apiUrl}/api/sourcerecipes/filter/${values.newRecipeRecipeGroup}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const recipesjson = await recipesresponse.json();
        if (recipesresponse.ok) {
          recipes = recipesjson;
          existingRecipesLength = recipes.length;
        }
      }
      const randomColor = `${existingRecipesLength * 34} 65% 50%`;
      // end generate random Color

      const newItem = {
        name: values.newRecipe,
        amount: values.newRecipeAmount,
        createdBy: values.newUserName,
        serving: values.newRecipeServing,
        instruction: values.newRecipeInstruction,
        cookingtime: values.newRecipeCookingTime,
        recipegroupId: values.newRecipeRecipeGroup,
        recipegroupName: values.newRecipeRecipeGroupName,
        color: randomColor,
      };

      let recipe = {};

      const reciperesponse = await fetch(`${apiUrl}/api/sourcerecipes/`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const recipejson = await reciperesponse.json();

      if (!reciperesponse.ok) {
        return toast.error(
          `There was a problem creating your recipe. ${recipejson.error}`
        );
      }
      if (reciperesponse.ok) {
        // setTitle('')
        // setLoad('')
        // setReps('')
        // setError(null)
        // setEmptyFields([])
        recipe = recipejson;
        return toast.success("Recipe created!");
      }
    } catch (e) {
      throw new Error("There was a problem creating your recipe. " + e);
    }

    // try {
    //   createRecipe({
    //     name: values.newRecipe,
    //     amount: values.newRecipeAmount,
    //     createdBy: values.newUserName,
    //     serving: values.newRecipeServing,
    //     instruction: values.newRecipeInstruction,
    //     cookingtime: values.newRecipeCookingTime,
    //     recipegroupId: values.newRecipeRecipeGroup,
    //   });
    //   return toast.success("Recipe created!");
    // } catch (e) {
    //   throw new Error("There was a problem creating your recipe.");
    // }
  }

  // end create recipe

  // delete recipe category

  if (_action === "deleteRecipeGroup") {
    try {
      // check recipe category if it contains any recipes

      // count the recipes under the current recipe category
      let recipes = [];

      if (user) {
        const recipesresponse = await fetch(
          `${apiUrl}/api/sourcerecipes/filter/${values.deleteRecipeGroupId}`,
          {
            credentials: "include",
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (recipesresponse.ok) {
          const recipesjson = await recipesresponse.json();
          recipes.push(...recipesjson);
        }
      }

      let existingRecipesLength = recipes.length;
      // end count the recipes under the current recipe category

      if (existingRecipesLength > 0) {
        return toast.error(
          "I'm sorry, I have found existing recipes for this Recipe Category. You are not allowed to delete it."
        );
      }
      // end check recipe category if it contains any recipes
      else {
        let recipegroup = {};

        const recipegroupresponse = await fetch(
          `${apiUrl}/api/sourcerecipegroups/${values.deleteRecipeGroupId}`,
          {
            credentials: "include",
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const recipegroupjson = await recipegroupresponse.json();

        if (!recipegroupresponse.ok) {
          return toast.error(
            `There was a problem deleting your recipe category. ${recipegroupjson.error}`
          );
        }
        if (recipegroupresponse.ok) {
          recipegroup = recipegroupjson;
          // return toast.success(`Recipe Category ${recipegroup.name} deleted!`);
          toast.success(`Recipe Category ${recipegroup.name} deleted!`);
          return redirect(`/`);
        }
      }
    } catch (e) {
      throw new Error(
        "There was a problem deleting your recipe category. " + e
      );
    }
  }

  // end delete recipe category

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

    // try {
    //   createIngredient({
    //     name: values.newIngredient,
    //     amount: values.newIngredientAmount,
    //     unit: values.newIngredientUnit,
    //     price: values.newIngredientPrice,
    //     createdBy: values.newUserName,
    //     recipeId: values.newIngredientRecipe,
    //     recipeName: values.newIngredientRecipeName,
    //     recipegroupId: values.newIngredientRecipeGroup,
    //     recipegroupName: values.newIngredientRecipeGroupName,
    //     ingredientSqlId: values.newIngredientSqlId,
    //   });
    //   return toast.success(`Ingredient ${values.newIngredient} created!`);
    // } catch (e) {
    //   throw new Error("There was a problem creating your ingredient.");
    // }
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

    // try {
    //   deleteItem({
    //     key: "ingredients",
    //     id: values.ingredientId,
    //   });
    //   return toast.success("Ingredient deleted!");
    // } catch (e) {
    //   throw new Error("There was a problem deleting your ingredient.");
    // }
  }

  // end delete ingredient
}

const RecipeGroupMenuPage = () => {
  const fetcher = useFetcher();
  const {
    recipegroup,
    userName,
    user,
    recipes,
    ingredients,
    sourceIngredients,
  } = useLoaderData();
  const { usertype } = user;
  const navigate = useNavigate();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <div className="flex-md">
            <button className="btn btn--dark" onClick={() => navigate(-1)}>
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
          </div>
          <h1>
            List of,{" "}
            <span className="accent">
              {recipegroup.name}
              {"."}
            </span>
          </h1>
          <div className="grid-sm">
            <p>
              This page contains all of the recipes from the category{" "}
              <strong>{recipegroup.name}</strong>
            </p>
          </div>
          {/* delete button */}
          <div
            className="flex-sm"
            hidden={usertype !== "Chef"}
            // hidden
          >
            <fetcher.Form
              method="post"
              onSubmit={(ev) => {
                if (
                  !confirm(
                    `Are you sure you want to permanently delete the ${recipegroup.name} recipe category?`
                  )
                ) {
                  ev.preventDefault();
                }
              }}
              hidden={usertype !== "Chef"}
            >
              <input type="hidden" name="_action" value="deleteRecipeGroup" />
              <input type="hidden" name="deleteRecipeGroupId" value={recipegroup._id} />
              <button
                type="submit"
                className="btn btn--warning"
                hidden={usertype !== "Chef"}
              >
                <span>Delete this Recipe Category</span>
                <TrashIcon width={20} />
              </button>
            </fetcher.Form>
          </div>
          {/* end delete button */}

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

          <div className="grid-sm">
            {recipes && recipes.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddRecipeForm
                    recipegroup={recipegroup}
                    userName={userName}
                    usertype={usertype}
                  />
                  <AddIngredientForm
                    recipes={recipes}
                    recipegroupId={recipegroup._id}
                    recipegroupName={recipegroup.name}
                    userName={userName}
                    usertype={usertype}
                    sourceIngredients={sourceIngredients}
                  />
                </div>
                <h2>Existing Recipes</h2>
                <div className="recipes">
                  {recipes.map((recipe) => (
                    <RecipeItem
                      key={recipe._id}
                      recipe={recipe}
                      usertype={usertype}
                    />
                  ))}
                </div>
                {ingredients && ingredients.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Ingredients</h2>
                    <Table
                      ingredients={ingredients
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 24)}
                      user={user}
                    />
                    {/* {ingredients.length > 24 && (
                      <Link to="/ingredients" className="btn btn--dark">
                        View all ingredients
                      </Link>
                    )} */}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Your recipes, designed in one place.</p>
                <p hidden={usertype !== "Chef"}>
                  Create a Recipe to get started!
                </p>
                <AddRecipeForm
                  recipegroup={recipegroup}
                  userName={userName}
                  usertype={usertype}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default RecipeGroupMenuPage;
