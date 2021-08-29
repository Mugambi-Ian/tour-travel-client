import React from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { _auth } from "../../../config";
import "./dashboard.css";

class Dashboard extends React.Component {
  state = {
    currentScreen: "listings",
  };
  componentDidMount() {
    this.props.history.push("/");
  }
  render() {
    return (
      <div className="landing-page">
        <div className="app-content">
          <Switch></Switch>
        </div>
        <div className="nav-bar">
          <img
            src={require("../../../assets/drawables/logo.png").default}
            className="logo unselectable"
            alt=""
          />
          <Link
            to="/listings"
            className={
              this.state.currentScreen === "listings"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "listings")
                  this.setState({ currentScreen: "listings" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-listing.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Listings</p>
            <span />
          </Link>
          <Link
            to="/bookings"
            className={
              this.state.currentScreen === "bookings"
                ? "nav-item on"
                : "nav-item"
            }
            onClick={async () => {
              await setTimeout(() => {
                if (this.state.currentScreen !== "bookings")
                  this.setState({ currentScreen: "bookings" });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-booking.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Bookings</p>
            <span />
          </Link>
          <div
            style={{ marginLeft: 0 }}
            className="nav-item"
            onClick={async () => {
              await setTimeout(() => {
                this.props.editProfile();
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-profile.png").default}
              className="unselectable"
              alt=""
              style={{ borderRadius: "100px" }}
            />
            <p className="unselectable">Profile</p>
            <span />
          </div>
          <div
            id="last"
            className="nav-item"
            onClick={async () => {
              await setTimeout(() => {
                _auth.signOut().then(() => {
                  this.props.revokeAccess();
                });
              }, 200);
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-logout.png").default}
              className="unselectable"
              alt=""
            />
            <p className="unselectable">Sign Out</p>
            <span />
          </div>
        </div>
      </div>
    );
  }
}
export default class Home extends React.Component {
  render() {
    return (
      <Router>
        <Route
          render={({ history }) => (
            <Dashboard
              history={history}
              user={this.props.currentUser}
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
              revokeAccess={this.props.revokeAccess}
              editProfile={this.props.editProfile}
            />
          )}
        />
      </Router>
    );
  }
}
