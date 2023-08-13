// rrd imports
import { Form, Link } from "react-router-dom";

// library imports
import ReactTimeAgo from "react-time-ago";
import { BanknotesIcon, ChatBubbleOvalLeftEllipsisIcon, FireIcon } from "@heroicons/react/24/outline";

// helper functions
import {
//   calculateSpentByRecipe,
  formatCurrency,
  formatPercentage,
  categories
} from "../helpers";

const RecipeGroupItem = ({ recipegroup, user }) => {
  const { _id, name, updatedby, createdAt, color } = recipegroup;
  const { usertype } = user;
  //   const spent = calculateSpentByRecipe(id);

  const filtered = categories.filter(category => {
    return category.name === recipegroup.name;
  });

  const image = filtered[0].image;

  return (
    <div
      className="recipe"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        {/* <FireIcon width={20} /> */}
        <small>
          <ReactTimeAgo
            date={createdAt}
            locale="en-US"
            timeStyle="round-minute"
          />
        </small>
      </div>

      <progress max={10} value={10}>
        {formatPercentage(10 / 10)}
      </progress>

      <div className="progress-text">
        <small>id: { _id }</small>
        <small>Updated by: { updatedby }</small>
      </div>

      <div className="progress-text">
        <small></small>
      </div>

      <div className="flex-sm">
        <img src={image} height="250" width="400" />
      </div>

      <div className="flex-sm">
        {usertype !== 'Chef' ? 'Only the Chefs can add recipes here' : 'Tap button below to add a new Recipe'}
        <Link to={`/recipegroup/${_id}`} className="btn">
          <span>{usertype === 'Chef' ? 'Add Recipe' : `See what's on the list`}</span>
          <FireIcon width={20} />
        </Link>
        <Link to={`/comment/${_id}`} className="btn">
          <span>Add Comment</span>
          <ChatBubbleOvalLeftEllipsisIcon width={20} />
        </Link>
      </div>

    </div>
  );
};
export default RecipeGroupItem;