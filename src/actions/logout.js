// rrd imports
import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";

// helpers
import { deleteItem } from "../helpers";

export async function logoutAction() {
  // delete the user
  // deleteItem({
  //   key: "user"
  // })
  // deleteItem({
  //   key: "userName"
  // })

  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const response = await fetch(`${apiUrl}/logout`, {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json();

  console.log(json);

  // deleteItem({
  //   key: "recipegroups"
  // })
  // deleteItem({
  //   key: "recipes"
  // })
  // deleteItem({
  //   key: "comments"
  // })
  // deleteItem({
  //   key: "ingredients"
  // })
  toast.success("You've signed-out sucessfully!");
  // return redirect
  return redirect("/");
}
