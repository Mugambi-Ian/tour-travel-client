/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import Loader from "../assets/components/loader/loader";
import Toast, { toast } from "../assets/components/toast/toast";
import { _auth } from "../config";
import Home from "./main-app";
import Login from "./main-auth/main-auth";
import Splash from "./main-splash/main-splash";
import "./main.css";

export default class App extends Component {
  state = {
    loading: true,
    activeSplash: true,
    toast: toast,
    authBypass: false,
    dialog: {
      open: false,
      message:
        " authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false, authBypass: false,",
      cancelFunc: undefined,
      confirmFunc: undefined,
      title: "authBypass",
    },
  };
  async componentDidMount() {
    await _auth.onAuthStateChanged(async (u) => {
      if (this.state.authBypass === false) {
        if (u) {
          this.setState({ authenticated: true });
        }
      }
      this.setState({ loading: false });
    });
  }
  showTimedToast(message) {
    const toast = {
      showToast: true,
      toastMessage: message,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  showUnTimedToast() {
    const toast = {
      showToast: true,
      toastTimed: false,
    };
    this.setState({ toast: toast });
  }
  closeToast() {
    const toast = {
      showToast: false,
      toastMessage: this.state.toast.toastMessage,
      toastTimed: true,
    };
    this.setState({ toast: toast });
  }
  render() {
    return (
      <div className="main-body">
        {this.state.activeSplash === true ? (
          <Splash
            closeSplash={() => {
              this.setState({ activeSplash: false });
            }}
          />
        ) : this.state.loading === true ? (
          <Loader />
        ) : this.state.authenticated === true ? (
          <Home
            init={() => {
              this.setState({ authBypass: true });
            }}
            revokeAccess={() => {
              this.setState({ authenticated: false });
            }}
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
          />
        ) : (
          <Login
            init={() => {
              this.setState({ authBypass: true });
            }}
            authorizeUser={() => {
              this.setState({ authenticated: true });
            }}
            closeToast={this.closeToast.bind(this)}
            showTimedToast={this.showTimedToast.bind(this)}
            showUnTimedToast={this.showUnTimedToast.bind(this)}
          />
        )}
        {this.state.dialog.open ? (
          <div className="dialog-body">
            <div className="dialog-box">
              <h3 className="dialog-title unselectable">
                {this.state.dialog.title}
              </h3>
              <p className="msg unselectable">{this.state.dialog.message}</p>
              <div className="options">
                <p
                  className="rd unselectable"
                  onClick={async () => {
                    await setTimeout(() => {
                      if (this.state.dialog.cancelFunc) {
                        this.state.dialog.cancelFunc();
                      }
                      const d = this.state.dialog;
                      d.open = false;
                      this.setState({ dialog: d });
                    }, 100);
                  }}
                >
                  Cancel
                </p>
                <p
                  className="unselectable"
                  onClick={async () => {
                    await setTimeout(() => {
                      if (this.state.dialog.confirmFunc) {
                        this.state.dialog.confirmFunc();
                      }
                      const d = this.state.dialog;
                      d.open = false;
                      this.setState({ dialog: d });
                    }, 100);
                  }}
                >
                  Confirm
                </p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.toast.showToast ? (
          <Toast
            timed={this.state.toast.toastTimed}
            message={this.state.toast.toastMessage}
            closeToast={this.closeToast.bind(this)}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
