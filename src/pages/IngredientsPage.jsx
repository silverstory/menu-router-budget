// rrd imports
import {
  useLoaderData,
  useRouteError,
  Link,
  useNavigate,
} from "react-router-dom";

// library import
import { toast } from "react-toastify";
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

// component imports
import Table from "../components/Table";

//  helper functions
import { deleteItem, fetchData, waait } from "../helpers";

// components
import Intro from "../components/Intro";

// loader
export async function ingredientsLoader() {
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

  // change to get ingredients from db
  const ingredients = await fetchData("ingredients");


  return { userName, user, ingredients };
}

// action
export async function ingredientsAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "deleteIngredient") {
    try {
      deleteItem({
        key: "ingredients",
        id: values.ingredientId,
      });
      return toast.success("Ingredient deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your ingredient.");
    }
  }
}

const IngredientsPage = () => {
  const { userName, user, ingredients } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      {userName ? (
        <div className="grid-lg">
          <div className="flex-md">
            <button className="btn btn--dark" onClick={() => navigate(-1)}>
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
          </div>
          <h1>All Ingredients</h1>
          {ingredients && ingredients.length > 0 ? (
            <div className="grid-md">
              <h2>
                Recent Ingredients <small>({ingredients.length} total)</small>
              </h2>
              <Table ingredients={ingredients} user={user} />
            </div>
          ) : (
            <p>No Ingredients to show</p>
          )}
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};

export default IngredientsPage;
