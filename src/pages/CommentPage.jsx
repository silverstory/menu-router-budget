// reacts
import React, { useState, useEffect, useRef } from "react";

// rrd imports
import {
  useRouteError,
  Link,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

// library imports
import { toast } from "react-toastify";
import { assert, object, string, nonempty, StructError } from "superstruct";
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

// custom hooks
import useLocalStorage from "../hooks/useLocalStorage";

// custom components
import CustomForm from "../components/CustomForm";
import EditForm from "../components/EditForm";
import CommentList from "../components/CommentList";

//  helper functions
import {
  fetchData,
  waait,
  isObjectEmpty,
  getAllMatchingItems,
} from "../helpers";

// components
import Intro from "../components/Intro";

// loader
export async function commentPageLoader({ params }) {
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

  // get the recipegroup
  // const recipegroup = await getAllMatchingItems({
  //   category: "recipegroups",
  //   key: "id",
  //   value: params.id,
  // })[0];

  let recipegroup = {};

  if (user) {
    // recipegroup

    const recipegroupresponse = await fetch(
      `${apiUrl}/api/sourcerecipegroups/${params.id}`,
      {
        credentials: "include",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const rcjson = await recipegroupresponse.json();

    if (recipegroupresponse.ok) {
      recipegroup = rcjson;
    }
  }

  // const _comments = await getAllMatchingItems({
  //   category: "comments",
  //   key: "recipegroupId",
  //   value: recipegroup._id,
  // });

  let comments = [];

  if (user) {
    const commentsresponse = await fetch(
      `${apiUrl}/api/sourcecomments/filter/${recipegroup._id}`,
      {
        credentials: "include",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const commentsjson = await commentsresponse.json();

    if (commentsresponse.ok) {
      // comments = commentsjson;

      const _comments = await Promise.all(
        commentsjson.map(async (_comment) => {
          let u = {};

          const uresponse = await fetch(
            `${apiUrl}/api/user/${_comment.updatedby}`,
            {
              credentials: "include",
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );

          const ujson = await uresponse.json();

          if (uresponse.ok) {
            u = ujson;

            _comment.updatedby = (await "(") + u.usertype + ") " + u.username;
          }

          if (!u || isObjectEmpty(u)) {
            // throw new Error("The user you’re trying to find doesn’t exist");
            console.log(
              "The user you’re trying to find doesn’t exist. [commentpage: loader]"
            );
          }

          return _comment;
        })
      );

      comments.push(..._comments);
    }
  }

  const userprompt = "(" + user.usertype + ") " + userName;

  // localStorage.setItem("isEditComment", false);

  const sEditComment = Math.floor((Math.random() * 100) + 1);

  return { recipegroup, user, userName, userprompt, comments, sEditComment };
}

// action
export async function commentPageAction({ request }) {
  await waait();

  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

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

  if (_action === "createComment") {
    try {
      // add

      const newItem = {
        name: values.newComment,
        recipegroupId: values.newCommentRecipeGroup,
      };

      let comment = {};

      const commentresponse = await fetch(`${apiUrl}/api/sourcecomments/`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const cjson = await commentresponse.json();

      if (!commentresponse.ok) {
        return toast.error(
          `There was a problem creating your comment. ${cjson.error}`
        );
      }
      if (commentresponse.ok) {
        comment = cjson;
        // console.log(comment);
        return toast.success("Comment created!");
      }

      // end add
    } catch (e) {
      throw new Error("There was a problem creating your comment. " + e);
    }
  }

  // deleteComment
  if (_action === "deleteComment") {
    try {
      let deletecomment = {};

      const deletecommentresponse = await fetch(
        `${apiUrl}/api/sourcecomments/${values.deleteCommentId}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const deletecommentjson = await deletecommentresponse.json();

      if (!deletecommentresponse.ok) {
        return toast.error(
          `There was a problem deleting your comment. ${deletecommentjson.error}`
        );
      }
      if (deletecommentresponse.ok) {
        deletecomment = deletecommentjson;
        return toast.success(`Comment ${deletecomment.name} deleted!`);
      }
    } catch (e) {
      throw new Error("There was a problem deleting your comment. " + e);
    }
  }

  // updateComment
  // editComment
  // editCommentRecipeGroup
  if (_action === "updateComment") {
    try {
      // add

      const newItem = {
        name: values.editComment,
        // recipegroupId: values.editCommentRecipeGroup,
      };

      let comment = {};

      const commentresponse = await fetch(
        `${apiUrl}/api/sourcecomments/${values.editCommentId}`,
        {
          credentials: "include",
          method: "PATCH",
          body: JSON.stringify(newItem),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const cjson = await commentresponse.json();

      if (!commentresponse.ok) {
        return toast.error(
          `There was a problem updating your comment. ${cjson.error}`
        );
      }
      if (commentresponse.ok) {
        comment = cjson;
        return toast.success("Comment updated!");
      }

      // end add
    } catch (e) {
      throw new Error("There was a problem updating your comment. " + e);
    }
  }
}

function CommentPage() {
  const { recipegroup, user, userName, userprompt, comments, sEditComment } =
    useLoaderData();
  const navigate = useNavigate();

  // const [comments, setComments] = useLocalStorage(
  //   "comments",
  //   [],
  //   recipegroup._id
  // );
  const [previousFocusEl, setPreviousFocusEl] = useState(null);
  const [editedComment, setEditedComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // // This will run one time after the component mounts
  // useEffect(() => {
  //   const onPageLoad = () => {
  //     // setPlayAnimation(true);
  //     try {
  //       closeEditMode();
  //     } catch (error) { 
  //     }
  //   };

  //   // Check if the page has already loaded
  //   if (document.readyState === "complete") {
  //     onPageLoad();
  //   } else {
  //     window.addEventListener("load", onPageLoad);
  //     // Remove the event listener when component unmounts
  //     return () => window.removeEventListener("load", onPageLoad);
  //   }
  // }, []);

  useEffect(() => {
    try {
      closeEditMode();
    } catch (error) { }
  }, [sEditComment]);

  const addComment = async (c) => {};

  const deleteComment = (id) => {
    // setComments((prevState) => prevState.filter((t) => t.id !== id));
  };

  const toggleComment = (id) => {
    // setComments((prevState) =>
    //   prevState.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    // );
  };

  const updateComment = (comment) => {
    // setComments((prevState) =>
    //   prevState.map((t) =>
    //     t.id === comment.id ? { ...t, name: comment.name } : t
    //   )
    // );
    closeEditMode();
  };

  const closeEditMode = () => {
    setIsEditing(false);
    previousFocusEl.focus();
  };

  const enterEditMode = (comment) => {
    setEditedComment(comment);
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  };

  return (
    <>
      {userName ? (
        <div className="container">
          <div className="flex-md">
            <button className="btn btn--dark" onClick={() => navigate(-1)}>
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
            {/* <Link to="/" className="btn btn--dark">
          <HomeIcon width={20} />
          <span>Go home</span>
        </Link> */}
          </div>
          <header>
            {/* uncomment for events */}
            {/* <h3>Comments for Event</h3> */}
            <h3>Comments for recipe category</h3>
            <h1>
              {/* uncomment for events */}
              {/* {recipegroup.name}, {recipegroup.pax} Pax */}
              {recipegroup.name}
            </h1>

            {/* uncomment for events */}
            {/* <h3>
              RecipeGroup starts on{" "}
              <strong>{recipegroup.recipegroupdate}</strong> at{" "}
              <strong>{recipegroup.recipegrouptime}</strong>
            </h3>
            <h3>
              Holding room - <strong>{recipegroup.holdingroom}</strong>
            </h3>
            <h4>
              Venue - <strong>{recipegroup.venue}</strong>
            </h4> */}
          </header>
          {isEditing && (
            <EditForm
              editedComment={editedComment}
              updateComment={updateComment}
              closeEditMode={closeEditMode}
              recipegroup={recipegroup}
              userName={userprompt}
            />
          )}
          <CustomForm recipegroup={recipegroup} />
          {comments && (
            <CommentList
              comments={comments}
              deleteComment={deleteComment}
              toggleComment={toggleComment}
              enterEditMode={enterEditMode}
              userName={userprompt}
            />
          )}
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default CommentPage;
