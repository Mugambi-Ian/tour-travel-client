import React, { Component } from "react";
import Lottie from "react-lottie";
import "./main-splash.css";

export default class Splash extends Component {
  state = {
    animIn: true,
  };

  async componentDidMount() {
    await setTimeout(async () => {
      this.setState({ animIn: false });
      await setTimeout(() => {
        this.props.closeSplash();
      }, 1400);
    }, 2800);
  }
  render() {
    return (
      <div
        id={this.state.animIn === true ? "start" : "exit"}
        className="splash-body"
      >
        <div className="splash-anim">
          <Lottie
            options={{
              loop: 1,
              autoplay: true,
              animationData: require("../../assets/animations/mov-splash.json"),
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
          />
        </div>
      </div>
    );
  }
}
