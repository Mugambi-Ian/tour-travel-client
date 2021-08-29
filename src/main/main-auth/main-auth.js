/* eslint-disable no-restricted-globals */
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import React, { Component } from "react";
import { _auth } from "../../config";
import "./main-auth.css";

export default class Login extends Component {
  state = { email: "", password: "", showPassword: true };

  componentDidMount() {
    this.props.init();
  }

  signIn() {
    signInWithPopup(_auth, new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        if (user) {
          this.props.showTimedToast("Sign in Successfull");
          this.props.authorizeUser();
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  render() {
    return (
      <>
        <div className="login-body">
          <div className="login-card">
            <img
              src={require("../../assets/drawables/logo.png").default}
              alt=""
            />
            <h1>Welcome</h1>
            <h3>Sign in to proceed</h3>
            <div
              className="g-btn"
              onClick={async () =>
                await setTimeout(() => {
                  this.signIn();
                }, 200)
              }
            >
              <img
                src={require("../../assets/drawables/ic-google.png").default}
                alt=""
              />
              <p>Sign In</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
