import React from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { _auth } from "../../../config";
import "./dashboard.css";
import Listings from "./lisitings/listings";
import Bookings from "./bookings/bookings";
let appRoute = false;

export default class Dashboard extends React.Component {
  state = {
    currentScreen: "listings",
  };
  componentDidUpdate(p, s) {
    if (s.history && !appRoute) {
      s.history.push("");
      appRoute = true;
    }
  }

  render() {
    const { listings,bookings } = this.props;
    return (
      <Router>
        <Route
          render={({ history }) => {
            return (
              <div className="landing-page">
                <SetHistory history={history} />
                <div className="app-content">
                  <Switch>
                    <Route path={"/bookings"} exact>
                      <Bookings
                        listings={listings}
                        bookings={bookings}
                        closeToast={this.props.closeToast}
                        showTimedToast={this.props.showTimedToast}
                        showUnTimedToast={this.props.showUnTimedToast}
                      />
                    </Route>
                    <Route path={""} exact>
                      <Listings
                        listings={listings}
                        closeToast={this.props.closeToast}
                        showTimedToast={this.props.showTimedToast}
                        showUnTimedToast={this.props.showUnTimedToast}
                      />
                    </Route>
                  </Switch>
                </div>
                <div className="nav-bar">
                  <img
                    src={require("../../../assets/drawables/logo.png").default}
                    className="logo unselectable"
                    alt=""
                  />
                  <Link
                    to="/"
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
                      src={
                        require("../../../assets/drawables/ic-listing.png")
                          .default
                      }
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
                      src={
                        require("../../../assets/drawables/ic-booking.png")
                          .default
                      }
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
                      src={
                        require("../../../assets/drawables/ic-profile.png")
                          .default
                      }
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
                      src={
                        require("../../../assets/drawables/ic-logout.png")
                          .default
                      }
                      className="unselectable"
                      alt=""
                    />
                    <p className="unselectable">Sign Out</p>
                    <span />
                  </div>
                </div>
              </div>
            );
          }}
        />
      </Router>
    );
  }
}
class SetHistory extends React.Component {
  componentDidMount() {
    this.props.history.push("");
  }
  render() {
    return <span />;
  }
}
