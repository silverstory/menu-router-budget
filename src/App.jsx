import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
// import { deleteRecipe } from "./actions/deleteRecipe";
// import { deleteRecipeGroup } from "./actions/deleteRecipeGroup";

// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import SignupPage, { signupAction, signupLoader } from "./pages/SignupPage";
import Error from "./pages/Error";
import RecipePage, { recipeAction, recipeLoader } from "./pages/RecipePage";
import CommentPage, { commentPageLoader, commentPageAction } from "./pages/CommentPage";
import IngredientsPage, {
  ingredientsAction,
  ingredientsLoader,
} from "./pages/IngredientsPage";
import RecipeGroupMenuPage, {
  recipegroupMenuAction,
  recipegroupMenuLoader,
} from "./pages/RecipeGroupMenuPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />,
      },
      {
        path: "recipegroup/:id",
        element: <RecipeGroupMenuPage />,
        loader: recipegroupMenuLoader,
        action: recipegroupMenuAction,
        errorElement: <Error />,
        // children: [
        //   {
        //     path: "delete",
        //     action: deleteRecipeGroup,
        //   },
        // ],
      },
      {
        path: "comment/:id",
        element: <CommentPage />,
        loader: commentPageLoader,
        action: commentPageAction,
        errorElement: <Error />,
      },
      {
        path: "recipe/:id",
        element: <RecipePage />,
        loader: recipeLoader,
        action: recipeAction,
        errorElement: <Error />,
        // children: [
        //   {
        //     path: "delete",
        //     action: deleteRecipe,
        //   },
        // ],
      },
      {
        path: "ingredients",
        element: <IngredientsPage />,
        loader: ingredientsLoader,
        action: ingredientsAction,
        errorElement: <Error />,
      },
      {
        path: "signup",
        element: <SignupPage />,
        loader: signupLoader,
        action: signupAction,
        errorElement: <Error />,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
