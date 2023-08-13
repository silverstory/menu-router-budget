// react imports
import { useEffect, useRef, useState } from "react";

// rrd imports
import { useFetcher } from "react-router-dom";

// library imports
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

// helper functions
import { formatCurrency } from "../helpers";

const AddIngredientForm = ({
  recipes,
  recipegroupId,
  recipegroupName,
  userName,
  usertype,
  sourceIngredients,
}) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const formRef = useRef();
  const focusRef = useRef();

  const [name, setName] = useState("");
  const [sqlid, setSqlid] = useState(0);
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState(0);

  // select value
  // Using state to keep track of what the selected recipe is
  let [srecipe, setSrecipe] = useState("");

  // Using this function to update the state of recipe
  // whenever a new option is selected from the dropdown
  let handleSrecipeChange = async (e) => {
    if (e.target.value === "⬇️ Select a recipe ⬇️") {
      setSrecipe("");
    } else {
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

      let recipe = {};

      const reciperesponse = await fetch(
        `${apiUrl}/api/sourcerecipes/${e.target.value}`,
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const recipejson = await reciperesponse.json();

      if (reciperesponse.ok) {
        recipe = recipejson;
      }

      setSrecipe(recipe.name);
    }
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result);
  };

  const handleOnSelect = (item) => {
    // the item selected
    setName(item.name);
    setSqlid(item.id);
    setUnit(item.unit);
    setPrice(item.price);
  };

  const handleOnFocus = () => {
    // console.log("Focused");
  };

  const handleOnClear = () => {
    // console.log("Cleared");
    setName("");
    setSqlid(0);
    setUnit("");
    setPrice(0);
    setSrecipe("");
  };

  const formatResult = (item) => {
    return (
      <>
        <div
          className="form-wrapper"
          style={{ marginRight: "10px", "overflow-x": "hidden" }}
        >
          <h2 className="h3">{item.name}</h2>
          {/* <span>
            <small>id: {item.id}</small> {". "}
            <small>unit: {item.unit}</small> {". "}
            <small>price: {formatCurrency(item.price)}</small>
          </span> */}
        </div>

        {/* <div
          className="recipe"
          style={{
            "--accent": "0 65% 50%",
            "marginRight": "20px",
            "overflow-x": "hidden"
          }}
        >
          <div className="progress-text">
            <h4>name: {item.name}</h4>
            <small>id:{item.id}</small>
          </div>
          <div className="progress-text">
            <h4>unit: {item.unit}</h4>
            <small>price: {formatCurrency(item.price)}</small>
          </div>
        </div> */}
      </>
    );
  };

  useEffect(() => {
    if (!isSubmitting) {
      // clear add ingredients fields
      handleOnClear();
      // clear form
      formRef.current.reset();
      // reset focus
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Add New{" "}
        <span className="accent">
          {recipes.length === 1 && `${recipes.map((budg) => budg.name)}`}
        </span>{" "}
        Ingredient
      </h2>
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
        hidden={usertype !== "Chef"}
      >
        <div className="ingredient-inputs">
          <div className="grid-xs">
          <label htmlFor="newIngredientAmount">
          ❶ ⬇️ Select an ingredient ⬇️
            </label>
            <ReactSearchAutocomplete
              items={sourceIngredients}
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
              showClear={true}
              onClear={handleOnClear}
            />
          </div>
        </div>
        <div className="ingredient-inputs">
          <div className="grid-xs">
            <label htmlFor="newIngredient">Ingredient Name</label>
            <input
              type="text"
              name="newIngredient"
              id="newIngredient"
              placeholder="e.g., Chicken"
              required
              value={name}
              ref={focusRef}
              readonly
              style={{ backgroundColor: "peachpuff" }}
              // peachpuff
              // rosybrown
              // thistle
            />
          </div>
        </div>
        <div className="ingredient-inputs">
          <div className="grid-xs">
            <label htmlFor="newIngredientPrice">
              Price per unit in pesos. ₱
            </label>
            <input
              type="number"
              inputMode="decimal"
              name="newIngredientPrice"
              id="newIngredientPrice"
              placeholder="e.g., 3.50"
              required
              value={price}
              readonly
              style={{ backgroundColor: "thistle" }}
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newIngredientSqlId">Id</label>
            <input
              type="number"
              name="newIngredientSqlId"
              id="newIngredientSqlId"
              placeholder="e.g., 5"
              required
              value={sqlid}
              readonly
              style={{ backgroundColor: "peachpuff" }}
            />
          </div>
        </div>
        <div className="ingredient-inputs">
          <div className="grid-xs">
            <label htmlFor="newIngredientAmount">
            ❷ ⬇️ Amount {unit ? "in " + unit : ""} ⬇️
            </label>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              name="newIngredientAmount"
              id="newIngredientAmount"
              placeholder="e.g., 3.5"
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newIngredientUnit">Unit</label>
            <input
              type="text"
              name="newIngredientUnit"
              id="newIngredientUnit"
              placeholder="e.g., grams"
              required
              value={unit}
              readonly
              style={{ backgroundColor: "thistle" }}
            />
          </div>
        </div>
        <div className="grid-xs" hidden={recipes.length === 1}>
          <label htmlFor="newIngredientRecipe">❸ ⬇️ Select a recipe ⬇️</label>
          <select
            onChange={handleSrecipeChange}
            name="newIngredientRecipe"
            id="newIngredientRecipe"
            required
          >
            <option value={recipes.length === 1 ? `${recipes.map((budg) => budg._id) }` : "⬇️ Select a recipe ⬇️"}>
            {recipes.length === 1 ? `${recipes.map((budg) => budg.name) }` : " -- Select a recipe -- "}
            </option>
            {recipes
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((recipe) => {
                return (
                  <option key={recipe._id} value={recipe._id}>
                    {recipe.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="grid-xs">
          <label htmlFor="newIngredientRecipeName">Recipe Name</label>
          <input
            type="text"
            name="newIngredientRecipeName"
            id="newIngredientRecipeName"
            value={recipes.length === 1 ? `${recipes.map((budg) => budg.name) }` : srecipe}
            required
            readonly
            style={{ backgroundColor: "thistle" }}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newIngredientRecipeGroup">Recipe Group Id</label>
          <input
            type="text"
            name="newIngredientRecipeGroup"
            id="newIngredientRecipeGroup"
            value={recipegroupId}
            required
            readonly
            style={{ backgroundColor: "thistle" }}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newIngredientRecipeGroupName">
            Recipe Group Name
          </label>
          <input
            type="text"
            name="newIngredientRecipeGroupName"
            id="newIngredientRecipeGroupName"
            value={recipegroupName}
            required
            readonly
            style={{ backgroundColor: "thistle" }}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newUserName">Logged-in User</label>
          <input
            type="text"
            name="newUserName"
            id="newUserName"
            value={userName}
            required
            readonly
            style={{ backgroundColor: "rosybrown" }}
          />
        </div>
        <input type="hidden" name="_action" value="createIngredient" />
        <button
          type="submit"
          className="btn btn--dark"
          disabled={isSubmitting}
          hidden={usertype !== "Chef"}
        >
          {isSubmitting ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Add Ingredient</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};
export default AddIngredientForm;
