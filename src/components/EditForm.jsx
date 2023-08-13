// reacts
import React, { useState, useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher, redirect, json, useActionData } from "react-router-dom";

// styles
import styles from "./EditForm.module.css";

// library imports
import { CheckIcon } from "@heroicons/react/24/solid";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { assert, object, string, nonempty, StructError } from "superstruct";

const EditForm = ({
  editedComment,
  updateComment,
  closeEditMode,
  recipegroup,
  userName,
  commentId,
}) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const [comment, setComment] = useState("");

  const formRef = useRef();
  const focusRef = useRef();

  const prevSdataRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  // close editmode if fetcher data changes
  useEffect(() => {
    // if (fetcher.data !== prevSdata) {
    //   closeEditMode();
    // }
    // prevSdataRef.current = fetcher.data;
    // if (fetcher.state === "loading") {
    //   // run alert from here
    //   updateComment({});
    // }
    // if (fetcher.data) {
    //   // run alert from here
    //   closeEditMode();
    // }
  }, [fetcher.data]);

  const prevSdata = prevSdataRef.current;

  const [updatedCommentName, setUpdatedCommentName] = useState(
    editedComment.name
  );

  useEffect(() => {
    const closeModalIfEscaped = (e) => {
      e.key === "Escape" && closeEditMode();
    };

    window.addEventListener("keydown", closeModalIfEscaped);

    return () => {
      window.removeEventListener("keydown", closeModalIfEscaped);
    };
  }, [closeEditMode]);

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   updateComment({...editedComment, name: updatedCommentName})
  // }

  const actionData = useActionData();

  return (
    <div
      role="dialog"
      aria-labelledby="editTask"
      onClick={(e) => {
        e.target === e.currentTarget && closeEditMode();
      }}
    >
      <fetcher.Form
        method="post"
        className={styles.todo}
        ref={formRef}
        // onSubmit={handleFormSubmit}
      >
        {/* {actionData} */}
        {/* fetcher.submit() */}
        {/* {fetcher.data} */}
        <div className={styles.wrapper}>
          <input
            type="text"
            name="editComment"
            id="editComment"
            className={styles.input}
            value={updatedCommentName}
            onInput={(e) => setUpdatedCommentName(e.target.value)}
            required
            ref={focusRef}
            maxLength={60}
            placeholder="Update Comment"
          />
          <label htmlFor="editComment" className={styles.label}>
            Update Comment
          </label>
        </div>
        <div className={styles.wrapper} hidden={true}>
          <label htmlFor="editCommentRecipeGroup">RecipeGroup Id</label>
          <input
            type="text"
            name="editCommentRecipeGroup"
            id="editCommentRecipeGroup"
            className={styles.input}
            value={recipegroup._id}
            readonly
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
          />
        </div> */}
        {/* <button
          className={styles.btn}
          aria-label={`Confirm edited comment`}
          type="submit"
        >
          <CheckIcon strokeWidth={2} height={24} width={24} />
        </button> */}

        <input type="hidden" name="_action" value="updateComment" />
        <input type="hidden" name="editCommentId" value={editedComment._id} />
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
              <CheckIcon strokeWidth={2} height={24} width={24} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};
export default EditForm;
