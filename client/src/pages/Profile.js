import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`https://forum-5.herokuapp.com/auth/basicinfo/${id}`)
      .then((response) => {
        setUsername(response.data.username);
      });

    axios
      .get(`https://forum-5.herokuapp.com/posts/byuserId/${id}`)
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);

  return (
    <div className="ProfileContainer">
      <h1>プロフィールページ: {username}</h1>
      {authState.username === username && (
        <button
          onClick={() => {
            history.push("/changepassword");
          }}
        >
          パスワード変更
        </button>
      )}
      {listOfPosts.map((value, key) => {
        return (
          <div className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="userAndlike">
              <div className="profileUsername"> {value.username} </div>
              <ThumbUpAltIcon className="like" />
              <label className="like-points">{value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Profile;
