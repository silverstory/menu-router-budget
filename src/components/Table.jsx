// component import
import IngredientItem from "./IngredientItem";

const Table = ({ ingredients, user, showRecipe = true }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {["Name", "Amount", "Unit", "Price", "Added", "By", "Created", showRecipe ? "Recipe" : "", ""].map(
              (i, index) => (
                <th key={index}>{i}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient._id}>
              <IngredientItem ingredient={ingredient} user={user} showRecipe={showRecipe} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;