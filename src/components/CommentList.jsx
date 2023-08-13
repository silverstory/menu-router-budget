// component import
import CommentItem from "./CommentItem";

// styles
import styles from "./CommentList.module.css";

const CommentList = ({
  comments,
  deleteComment,
  toggleComment,
  enterEditMode,
  userName,
}) => {
  return (
    <ul className={styles.tasks}>
      {comments
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            deleteComment={deleteComment}
            toggleComment={toggleComment}
            enterEditMode={enterEditMode}
            userName={userName}
          />
        ))}
    </ul>
  );
};
export default CommentList;
