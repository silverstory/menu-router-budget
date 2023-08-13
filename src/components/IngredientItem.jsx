// rrd imports
import { Link, useFetcher } from "react-router-dom";

// library import
import ReactTimeAgo from "react-time-ago";
import { TrashIcon } from "@heroicons/react/24/solid";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

const IngredientItem = ({ ingredient, user, showRecipe }) => {
  const fetcher = useFetcher();

  const { usertype, token } = user;

  // const recipe = getAllMatchingItems({
  //   category: "recipes",
  //   key: "id",
  //   value: ingredient.recipeId,
  // })[0];

  return (
    <>
      <td>{ingredient.name}</td>
      <td>{ingredient.amount}</td>
      <td>{ingredient.unit}</td>
      <td>{formatCurrency(ingredient.price)}</td>
      <td>{formatDateToLocaleString(ingredient.createdAt)}</td>
      <td>{`..` + ingredient.createdBy.substr(ingredient.createdBy.length - 5)}</td>
      <td>
        <small>
          <ReactTimeAgo
            date={ingredient.createdAt}
            locale="en-US"
            timeStyle="round-minute"
          />
        </small></td>
      {showRecipe && (
        <td>
          <Link
            to={`/recipe/${ingredient.recipeId}`}
            style={{
              "--accent": ingredient.recipeColor,
            }}
          >
            {ingredient.recipeName}
          </Link>
        </td>
      )}
      <td>
        <fetcher.Form
          method="post"
          onSubmit={(ev) => {
            if (
              !confirm(
                `Are you sure you want to permanently delete the ${ingredient.name} ingredient?`
              )
            ) {
              ev.preventDefault();
            }
          }}
          hidden={usertype !== "Chef"}
        >
          <input type="hidden" name="_action" value="deleteIngredient" />
          <input type="hidden" name="ingredientId" value={ingredient._id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${ingredient.name} ingredient`}
            hidden={usertype !== "Chef"}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};
export default IngredientItem;
