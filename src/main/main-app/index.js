import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import Profile from "./profile/profile";
import Dashboard from "./dashboard/dashboard";
import MyDictionary from "../../assets/resources/my-dictionary";

export default class Home extends React.Component {
  state = {
    data: {
      currentUser: {},
      listings: new MyDictionary(),
    },
    currentScreen: "",
    loader: [
      false, //userData
      false, //listings
      false, //bookings
    ],
  };
  db = _database.ref();
  async componentDidMount() {
    await this.db
      .child("customers/" + _auth.currentUser.uid)
      .on("value", (x) => {
        if (x.hasChild("phoneNumber")) {
          const { data } = this.state;
          data.currentUser = x.val();
          const v = new MyDictionary();
          x.child("bookings").forEach((i) => {
            const val = i.val();
            v.set(i.key, val);
          });
          data.bookings = v;
          let current = 0;
          data.bookings.listKeys().forEach((val) => {
            this.db.child(`bookings/${val}`).on("value", (j) => {
              this.db.child(`admin/${j.val().adminId}`).on("value", (p) => {
                v.set(val, { ...j.val(), admin: p.val() });
                data.bookings = v;
                this.setState({ data });
                const { loader } = this.state;
                current = current + 1;
                if (current >= data.bookings.length()) {
                  loader[2] = true;
                  this.setState({ loader });
                }
                console.log(data, loader, current);
              });
            });
          });
        } else {
          this.setState({ currentScreen: "profile" });
        }
        const { loader } = this.state;
        loader[0] = true;
        this.setState({ loader });
      });
    await this.db.child("destinations/").on("value", (x) => {
      const v = new MyDictionary();
      x.forEach((i) => {
        const val = i.val();
        v.set(i.key, val);
        this.db.child(`admin/${i.val().adminId}`).on("value", (j) => {
          val.admin = j.val();
          v.set(i.key, val);
        });
      });
      const { loader, data } = this.state;
      loader[1] = true;
      data.listings = v;
      this.setState({ loader, data });
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
      data: { currentUser, listings, bookings },
      currentScreen,
    } = this.state;
    return this.isLoading() ? (
      <Loader />
    ) : currentScreen === "profile" ? (
      <Profile
        newUser={!currentUser.phoneNumber}
        admin={currentUser}
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
        bookings={bookings}
        listings={listings}
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
