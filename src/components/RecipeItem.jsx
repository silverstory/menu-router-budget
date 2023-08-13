// rrd imports
import { Form, Link, useFetcher } from "react-router-dom";

// library imports
import ReactTimeAgo from "react-time-ago";
import {
  BanknotesIcon,
  TrashIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

// helper functions
import {
  calculateSpentByRecipe,
  formatCurrency,
  formatPercentage,
} from "../helpers";

const RecipeItem = ({ recipe, usertype, showDelete = false }) => {
  const fetcher = useFetcher();
  const {
    _id,
    name,
    amount,
    createdBy,
    serving,
    instruction,
    cookingtime,
    color,
    createdAt,
  } = recipe;
  const spent = calculateSpentByRecipe(_id);

  return (
    <div
      className="recipe"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        {/* <p>{formatCurrency(amount)} Recipeed</p> */}
        <p>for {amount} Pax</p>
      </div>
      {/* <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress> */}
      <progress max={10} value={10}>
        {formatPercentage(10 / 10)}
      </progress>
      <div className="progress-text">
        {/* <small>id: {_id}</small> */}
        <small>
          <ReactTimeAgo
            date={createdAt}
            locale="en-US"
            timeStyle="round-minute"
          />
        </small>
        <small>Created by: {createdBy}</small>
        {/* <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(amount - spent)} remaining</small> */}
      </div>
      <div className="progress-text">
        <small>Cooking time: {cookingtime} minutes</small>
        <small>{serving} servings</small>
      </div>
      <div className="flex-sm">
        <img
          src="https://images.pexels.com/photos/33242/cooking-ingredient-cuisine-kitchen.jpg"
          height="250"
          width="400"
        />
      </div>
      <div className="flex-sm">
        <p>{instruction}</p>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <fetcher.Form
            method="post"
            onSubmit={(ev) => {
              if (
                !confirm(
                  `Are you sure you want to permanently delete the ${name} recipe?`
                )
              ) {
                ev.preventDefault();
              }
            }}
            hidden={usertype !== "Chef"}
          >
            <input type="hidden" name="_action" value="deleteRecipe" />
            <input type="hidden" name="deleteRecipeId" value={_id} />
            <button type="submit" className="btn" hidden={usertype !== "Chef"}>
              <span>Delete Recipe</span>
              <TrashIcon width={20} />
            </button>
          </fetcher.Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/recipe/${_id}`} className="btn">
            <span>View Details</span>
            <FireIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};
export default RecipeItem;
