// rrd imports
import { Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddRecipeGroupForm from "../components/AddRecipeGroupForm";
import RecipeGroupItem from "../components/RecipeGroupItem";

//  helper functions
import { createRecipeGroup, deleteItem, fetchData, waait } from "../helpers";

// const isObjectEmpty = (objectName) => {
//   return (
//     objectName &&
//     Object.keys(objectName).length === 0 &&
//     objectName.constructor === Object
//   );
// };

// const isObjectEmpty = (objectName) => {
//   return JSON.stringify(objectName) === "{}";
// };

// loader
export async function dashboardLoader() {
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

  if (!response.ok) {
    return toast.error(
      `Please log in. The app is unable to retrieve user information. Error message: ${json.error}`
    );
  }
  if (response.ok) {
    // // wag maglagay ng kahit ano dito. bawal.
    // // return toast.success(`You are logged-in ${json.userName}`);
  }

  let recipegroups = [];

  if (user) {
    const recipegroupsresponse = await fetch(
      `${apiUrl}/api/sourcerecipegroups`,
      {
        credentials: "include",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const json = await recipegroupsresponse.json();

    if (recipegroupsresponse.ok) {
      recipegroups = json;
    }
  }

  return { userName, user, recipegroups };
}

// action
export async function dashboardAction({ request }) {
  await waait();

  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  const email = values.email;
  const password = values.password;

  const postvalue = { email: email, password: password };

  // new user submission
  if (_action === "newUser") {
    try {
      const response = await fetch(`${apiUrl}/api/user/login`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postvalue),
      });

      const json = await response.json();

      if (!response.ok) {
        return toast.error(
          `Oops, that didn't go right. Error message: ${json.error}`
        );
      }
      if (response.ok) {
        return toast.success(`Welcome, ${json.username}`);
      }
    } catch (e) {
      // console.log(e);
      throw new Error("There was a problem signing in to your account. " + e);
    }
  }

  if (_action === "createRecipeGroup") {
    try {
      // createRecipeGroup({
      //   name: values.newRecipeGroup,
      //   updatedby: values.newUserName,
      // });

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

      // generate random Color
      let recipegroups = [];
      let existingRecipeGroupLength = 0;
      if (user) {
        const recipegroupsresponse = await fetch(
          `${apiUrl}/api/sourcerecipegroups`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const rcsjson = await recipegroupsresponse.json();
        if (recipegroupsresponse.ok) {
          recipegroups = rcsjson;
          existingRecipeGroupLength = recipegroups.length;
        }
      }
      const randomColor = `${existingRecipeGroupLength * 34} 65% 50%`;
      // end generate random Color

      const newItem = {
        name: values.newRecipeGroup,
        updatedby: values.newUserName,
        color: randomColor,
      };

      let recipegroup = {};

      const recipegroupresponse = await fetch(
        `${apiUrl}/api/sourcerecipegroups/`,
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

      const rcjson = await recipegroupresponse.json();

      if (!recipegroupresponse.ok) {
        return toast.error(
          `There was a problem creating your recipe category. ${rcjson.error}`
        );
      }
      if (recipegroupresponse.ok) {
        // setTitle('')
        // setLoad('')
        // setReps('')
        // setError(null)
        // setEmptyFields([])
        recipegroup = rcjson;
        return toast.success("Recipe Category created!");
      }
    } catch (e) {
      throw new Error("There was a problem creating your recipe category. " + e);
    }
  }
}

const Dashboard = () => {
  const { userName, user, recipegroups } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {recipegroups && recipegroups.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddRecipeGroupForm userName={userName} user={user} />
                  {/* <AddIngredientForm recipes={recipes} /> */}
                </div>
                <h2>Existing Recipe Categories</h2>
                <div className="recipes">
                  {recipegroups.map((recipegroup) => (
                    <RecipeGroupItem
                      key={recipegroup._id}
                      recipegroup={recipegroup}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid-sm">
                <p>Conveniently organize recipes in one spot.</p>
                <p>Create a recipe category to get started!</p>
                <AddRecipeGroupForm userName={userName} user={user} />
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
export default Dashboard;
