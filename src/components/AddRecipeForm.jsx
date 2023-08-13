// reacts
import { useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom"

// library imports
import { CurrencyDollarIcon, FireIcon } from "@heroicons/react/24/solid"

const AddRecipeForm = ({ recipegroup, userName, usertype }) => {

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting"

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset()
      focusRef.current.focus()
    }
  }, [isSubmitting])

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Create recipe
      </h2>
      
      <fetcher.Form
        method="post"
        className="grid-sm"
        ref={formRef}
        hidden={usertype !== 'Chef'}
      >
        <div className="grid-xs">
          <label htmlFor="newRecipe">Recipe Name</label>
          <input
            type="text"
            name="newRecipe"
            id="newRecipe"
            placeholder="e.g., Fried Chicken"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeAmount">No. of Pax</label>
          <input
            type="number"
            step="1"
            name="newRecipeAmount"
            id="newRecipeAmount"
            placeholder="e.g., 50"
            required
            inputMode="numeric"
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeServing">No. of Servings</label>
          <input
            type="number"
            step="1"
            name="newRecipeServing"
            id="newRecipeServing"
            placeholder="e.g., 50"
            required
            inputMode="numeric"
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeInstruction">Instructions</label>
          <input
            type="text"
            name="newRecipeInstruction"
            id="newRecipeInstruction"
            placeholder="e.g., Cook it."
            required
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeCookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            step="1"
            name="newRecipeCookingTime"
            id="newRecipeCookingTime"
            placeholder="e.g., 120"
            required
            inputMode="numeric"
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeRecipeGroup">Category Id</label>
          <input
            type="text"
            name="newRecipeRecipeGroup"
            id="newRecipeRecipeGroup"
            value={recipegroup._id}
            readonly
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newRecipeRecipeGroupName">Category Name</label>
          <input
            type="text"
            name="newRecipeRecipeGroupName"
            id="newRecipeRecipeGroupName"
            value={recipegroup.name}
            readonly
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newUserName">Logged-in User</label>
          <input
            type="text"
            name="newUserName"
            id="newUserName"
            value={userName}
            readonly
          />
        </div>
        <input type="hidden" name="_action" value="createRecipe" />
        <button type="submit" className="btn btn--dark" disabled={isSubmitting} hidden={usertype !== 'Chef'}>
          {
            isSubmitting ? <span>Submitting…</span> : (
              <>
                <span>Create recipe</span>
                <FireIcon width={20} />
              </>
            )
          }
        </button>
      </fetcher.Form>
    </div>
  )
}
export default AddRecipeForm