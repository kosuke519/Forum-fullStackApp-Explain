import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    axios
      .get(`https://forum-5.herokuapp.com/Posts/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
      });

    axios
      .get(`https://forum-5.herokuapp.com/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  const addComment = () => {
    axios
      .post(
        "https://forum-5.herokuapp.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`https://forum-5.herokuapp.com/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        alert("コメントを削除しました");
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://forum-5.herokuapp.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
        alert("投稿を削除しました");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("新しいタイトルを入力してください");
      axios.put(
        "https://forum-5.herokuapp.com/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("文章を編集してください");
      axios.put(
        "https://forum-5.herokuapp.com/posts/postText",
        {
          newText: newPostText,
          id: id,
        },

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="left">
        <div
          className="postTitle"
          onClick={() => {
            if (authState.username === postObject.username) {
              editPost("title");
            }
          }}
        >
          {postObject.title}
        </div>
        <div
          className="postText"
          onClick={() => {
            if (authState.username === postObject.username) {
              editPost("body");
            }
          }}
        >
          {postObject.postText}
        </div>
        <div className="postUser">{postObject.username}</div>
        {authState.username === postObject.username && (
          <button
            className="deleteBtn"
            onClick={() => {
              deletePost(postObject.id);
            }}
          >
            投稿を削除する
          </button>
        )}
      </div>

      <div className="right">
        <div className="addCommentContainer">
          <textarea
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> コメント投稿</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div className="comment">
                <label className="commentUser"> {comment.username}:</label>

                {comment.commentBody}
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
