import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
function CreatePost() {
  const { authState } = useContext(AuthContext);
  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem) {
      history.push("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("タイトルを記入してください"),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    axios
      .post("https://forum-5.herokuapp.com/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        history.push("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>タイトル</label>
          <ErrorMessage name="title" component="span" />
          <Field id="inputCreatePost" name="title" placeholder="タイトル" />
          <label>内容</label>
          <ErrorMessage name="postText" component="span" />
          <Field className="commentBox" id="inputCreatePost" name="postText" />

          <button type="submit">投稿</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
