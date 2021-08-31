import React from "react";
import { validField, _auth, _database, _storage } from "../../../config";
import "./profile.css";
import {
  EditInput,
  ImageUploader,
} from "../../../assets/components/Input/input";

export default class Profile extends React.Component {
  state = {
    loading: true,
    customer: {
      customerDp: "",
      customerId: _auth.currentUser.uid,
      phoneNumber: "",
      email: _auth.currentUser.email,
      fullName: "",
    },
  };
  async componentDidMount() {
    var { customer } = this.state;
    if (this.props.newUser !== true) {
      customer = this.props.admin;
    }
    this.setState({ customer, loading: false });
  }

  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.customer.customerId + new Date().getTime();
    const uploadTask = _storage
      .ref("customer/")
      .child(id + ".jpeg")
      .put(this.state.customer.customerDp);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(async () => {
                  var url = "" + downloadURL;
                  const { customer } = this.state;
                  customer.customerDp = url;
                  this.setState({ customer, uploadPic: undefined });
                  await this.syncUser();
                }, 1000);
              }.bind(this)
            )
            .catch(async (e) => {
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }
  async updateUser() {
    var { phoneNumber, email, fullName, customerDp } = this.state.customer;

    if (validField(phoneNumber) && validField(fullName) && validField(email)) {
      this.props.showUnTimedToast();
      if (this.state.uploadPic) {
        await this.uploadDp();
      } else {
        await this.syncUser();
      }
    } else if (validField(customerDp) === false)
      this.props.showTimedToast("Profile photo required");
    else this.props.showTimedToast("All fields are required");
  }
  async syncUser() {
    var { customer } = this.state;
    this.setState({ loading: true });
    if (this.props.newUser)
      await _database.ref("customers/" + customer.customerId).set(customer);
    else await _database.ref("customers/" + customer.customerId).update(customer);
    this.setState({ loading: false });
    this.props.closeToast();
    await setTimeout(() => {
      this.props.showTimedToast("Save Successfull");
      this.props.closeEditing();
    }, 500);
  }

  render() {
    return (
      <div className="profile-body">
        <div className="p-form">
          <h1>Edit Profile</h1>
          <h4>Fill out your details</h4>
          <ImageUploader
            src={this.state.customer.customerDp}
            hideField={() => {
              this.setState({ hideField: true });
            }}
            showField={() => {
              this.setState({ hideField: undefined });
            }}
            updateValue={(x) => {
              fetch(x)
                .then((res) => res.blob())
                .then((blob) => {
                  const { customer } = this.state;
                  customer.customerDp = blob;
                  this.setState({ customer, uploadPic: true });
                });
            }}
          />
          <EditInput
            value={this.state.customer.fullName}
            onChange={(e) => {
              const { customer } = this.state;
              customer.fullName = e.target.value;
              this.setState({ customer });
            }}
            name="Full Name"
            placeholder="John Snow"
          />
          <EditInput
            value={this.state.customer.phoneNumber}
            onChange={(e) => {
              const { customer } = this.state;
              customer.phoneNumber = e.target.value;
              this.setState({ customer });
            }}
            name="Whatsapp Contact"
            placeholder="+254798098595"
          />
          <div className="p-btns">
            <div
              id="left"
              className="p-btn"
              onClick={async () => {
                if (this.props.newUser)
                  await setTimeout(() => {
                    _auth.signOut().then(() => {
                      window.open(window.location.href, "_self");
                    });
                  }, 200);
                else
                  await setTimeout(() => {
                    this.props.closeEditing();
                  }, 200);
              }}
            >
              <p>Cancel</p>
            </div>
            <div
              className="p-btn"
              onClick={async () => {
                await setTimeout(() => {
                  this.updateUser();
                }, 200);
              }}
            >
              <p>Save</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
