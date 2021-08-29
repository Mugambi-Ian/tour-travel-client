import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import Profile from "./profile/profile";
import Dashboard from "./dashboard/dashboard";

export default class Home extends React.Component {
  state = {
    data: {
      currentUser: {},
    },
    currentScreen: "",
    loader: [
      false, //userData
    ],
  };
  async componentDidMount() {
    await _database
      .ref("customers/" + _auth.currentUser.uid)
      .on("value", (x) => {
        if (x.hasChild("phoneNumber")) {
          const { data } = this.state;
          data.currentUser = x.val();
          this.setState({ data });
        } else {
          this.setState({ currentScreen: "profile" });
        }
        const { loader } = this.state;
        loader[0] = true;
        this.setState({ loader });
      });
  }
  isLoading() {
    for (let i = 0; i < this.state.loader.length; i++) {
      const x = this.state.loader[i];
      if (!x) {
        return true;
      }
    }
    return false;
  }
  render() {
    const {
      data: { currentUser },
      currentScreen,
    } = this.state;
    return this.isLoading() ? (
      <Loader />
    ) : currentScreen === "profile" ? (
      <Profile
        newUser={!currentUser.phoneNumber}
        customer={currentUser}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        closeEditing={() => {
          this.setState({ currentScreen: "dashboard" });
        }}
      />
    ) : (
      <Dashboard
        user={currentUser}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        revokeAccess={this.props.revokeAccess}
        editProfile={() => {
          this.setState({ currentScreen: "profile" });
        }}
      />
    );
  }
}
