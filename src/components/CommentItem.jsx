// reacts
import React, { useState, useEffect, useRef } from "react";

// rrd imports
import { Form, useFetcher } from "react-router-dom";

// styles
import styles from "./CommentItem.module.css";

// Library imports
import ReactTimeAgo from "react-time-ago";
import { CheckIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const CommentItem = ({
  comment,
  deleteComment,
  toggleComment,
  enterEditMode,
  userName,
}) => {
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

  // const [isChecked, setIsChecked] = useState(comment.checked);

  // const handleCheckboxChange = (e) => {
  //   setIsChecked(!isChecked);
  //   toggleComment(comment._id);
  // };

  return (
    <li className={styles.task}>
      <div className={styles["task-group"]}>
        {/* <input
          type="checkbox"
          className={styles.checkbox}
          checked={isChecked}
          onChange={handleCheckboxChange}
          name={task.name}
          id={task.id}
        /> */}
        <label htmlFor="userName" className={styles.label}>
          {/* {comment.userName}: */}
          {comment.updatedby}:
        </label>
        <label htmlFor={comment._id} className={styles.label}>
          {comment.name}
          {/* <p className={styles.checkmark}>
            <CheckIcon strokeWidth={2} width={24} height={24} />
          </p> */}
        </label>
      </div>
      <div className={styles["task-group"]}>
        <small>
          <ReactTimeAgo
            date={comment.createdAt}
            locale="en-US"
            timeStyle="twitter"
          />
        </small>
        <div
          className={styles["task-group"]}
          hidden={comment.updatedby !== userName}
        >
          <button
            className="btn"
            ref={focusRef}
            aria-label={`Update ${comment.name} Task`}
            onClick={() => enterEditMode(comment)}
          >
            <PencilSquareIcon width={24} height={24} />
          </button>
          {/* <button
            className={`btn ${styles.delete}`}
            aria-label={`Delete ${comment.name} Comment`}
            onClick={() => deleteComment(comment._id)}
          >
            <TrashIcon width={24} height={24} />
          </button> */}

          <fetcher.Form method="post" ref={formRef}>
            <input type="hidden" name="_action" value="deleteComment" />
            <input type="hidden" name="deleteCommentId" value={comment._id} />
            <button
              type="submit"
              className={`btn ${styles.delete}`}
              aria-label={`Delete ${comment.name} Comment`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon />
                </>
              ) : (
                <>
                  <TrashIcon width={24} height={24} />
                </>
              )}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </li>
  );
};
export default CommentItem;
