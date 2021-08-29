import React, { Component } from "react";
import Loader from "../loader/loader";
import "./toast.css";
export default class Toast extends Component {
  constructor() {
    super();
    this.state = {
      toastLive: true,
    };
  }
  componentDidMount() {
    if (this.props.timed === true) {
      setTimeout(() => {
        this.setState({
          toastLive: false,
        });
      }, 2500);
    }
  }
  closeToast = () => {
    setTimeout(() => {
      this.props.closeToast();
    }, 450);
  };

  render() {
    if (this.state.toastLive === true) {
      return this.props.timed === true ? (
        <div className="t-message">
          <div className="body">
            <div className="t-message-body slide-up">
              <h4>{this.props.message}</h4>
            </div>
          </div>
          <div className="space" />
        </div>
      ) : (
        <div className="loader-t-message">
          <div className="loader-t-message-body">
            <div className="loader-body">
              <div class="loader ">
                <span />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.toastLive === false) {
      return this.props.timed === true ? (
        <div className="t-message">
          <div className="body">
            <div className="t-message-body slide-out">
              <h4>{this.props.message}</h4>
            </div>
          </div>
          <div className="space" />
          {this.closeToast()}
        </div>
      ) : (
        <div className="loader-t-message">
          <div className="loader-t-message-body">
            <Loader />
          </div>
        </div>
      );
    }
  }
}
export const toast = {
  showToast: false,
  toastMessage: "",
  toastTimed: false,
};
