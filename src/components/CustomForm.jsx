// reacts
import React, { useState, useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom";

// styles
import styles from "./CustomForm.module.css";

// library imports
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const CustomForm = ({ recipegroup }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  // const [comment, setComment] = useState("");

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   addComment({
  //     name: comment,
  //     checked: false,
  //     recipegroupId: recipegroup._id,
  //     userName: userName,
  //     id: Date.now()
  //   })
  //   addComment(comment);
  //   setComment("");
  // };

  return (
    <fetcher.Form
      method="post"
      className={styles.todo}
      ref={formRef}
      // onSubmit={handleFormSubmit}
    >
      <div className={styles.wrapper}>
        <input
          type="text"
          name="newComment"
          id="newComment"
          className={styles.input}
          // value={comment}
          // onInput={(e) => setComment(e.target.value)}
          required
          ref={focusRef}
          maxLength={60}
          placeholder="Enter Comment"
        />
        <label htmlFor="newComment" className={styles.label}>
          Enter Comment
        </label>
      </div>
      <div className={styles.wrapper} hidden={true}>
        <label htmlFor="newCommentRecipeGroup">RecipeGroup Id</label>
        <input
          type="text"
          name="newCommentRecipeGroup"
          id="newCommentRecipeGroup"
          className={styles.input}
          value={recipegroup._id}
          readonly
          hidden={true}
        />
      </div>
      {/* <div className={styles.wrapper} hidden={true}>
        <label htmlFor="newCommentUser">User Name</label>
        <input
          type="text"
          name="newCommentUser"
          id="newCommentUser"
          className={styles.input}
          value={userName}
          readonly
          hidden={true}
        />
      </div> */}
      {/* <button className={styles.btn} aria-label="Add Comment" type="submit">
        <PlusIcon />
      </button> */}

      <input type="hidden" name="_action" value="createComment" />
      <button
        type="submit"
        className={styles.btn}
        aria-label="Add Comment"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <ArrowPathIcon />
          </>
        ) : (
          <>
            <PlusIcon />
          </>
        )}
      </button>
    </fetcher.Form>
  );
};
export default CustomForm;
