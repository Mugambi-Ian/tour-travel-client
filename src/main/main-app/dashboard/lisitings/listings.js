import React from "react";
import Lottie from "react-lottie";
import ViewListing from "./view-listing/view-listing";
import "./listings.css";
import MyDictionary from "../../../../assets/resources/my-dictionary";
import { _auth, _database } from "../../../../config";

export default class Listings extends React.Component {
  state = {
    viewListing: undefined,
    currentView: 0,
    listingEnterance: "fade-right",
  };

  listingCard() {
    return <div />;
  }
  lisitingCard(p, i) {
    return (
      <li className="lisiting-card" key={i}>
        <img alt={p.lisitingName} src={p.listingDp} />
        <div className="info">
          <h2 className="title ">{p.name}</h2>
          {p.admin ? (
            <>
              <p className="copy">{p.admin.name}</p>
              <p className="copy">{p.admin.phoneNumber}</p>
              <p className="copy">{p.admin.email}</p>
            </>
          ) : (
            ""
          )}
        </div>
        <div
          className="btn "
          onClick={async () => {
            await setTimeout(() => {
              console.log(p);
              this.setState({ viewListing: p });
            }, 100);
          }}
        >
          Book Tour
        </div>
      </li>
    );
  }
  getListing() {
    const { listings } = this.props;
    const r = new MyDictionary();
    listings.getVaules().forEach((element) => {
      if (!element.hidden) {
        r.set(element.listingId, element);
      }
    });
    return r;
  }
  render() {
    const st = this.state;
    return (
      <>
        <div className="listing-body">
          {this.getListing().length() === 0 ? (
            <div className="no-listings">
              <div id="animation">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: require("../../../../assets/animations/mov-soon.json"),
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
              <p className="unselectable">Coming Soon</p>
            </div>
          ) : (
            <ol className="lisitings-list">
              {this.getListing()
                .getVaules()
                .map((d, i) => {
                  return this.lisitingCard(d, i);
                })}
              <div style={{ minHeight: "100px" }} />
            </ol>
          )}
        </div>
        {st.viewListing ? (
          <ViewListing
            listing={st.viewListing}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            closeProcess={() => {
              this.setState({ viewListing: undefined });
            }}
            bookListing={async (processOrder, listing, total) => {
              this.setState({ viewListing: undefined });
              try {
                this.props.showUnTimedToast();
                const { key } = await _database.ref("bookings").push();
                const pr = processOrder;
                let e = pr.startDate;
                pr.startDate = `${e.getFullYear()}_${
                  e.getMonth() + 1
                }_${e.getDate()}`;
                e = pr.endDate;
                pr.endDate = `${e.getFullYear()}_${
                  e.getMonth() + 1
                }_${e.getDate()}`;
                const order = {
                  customerId: _auth.currentUser.uid,
                  adminId: listing.adminId,
                  listingId: listing.listingId,
                  ...pr,
                  total,
                  orderId: key,
                };
                await _database.ref(`bookings/${key}`).set(order);
                await _database
                  .ref(`customers/${_auth.currentUser.uid}/bookings`)
                  .update({ [order.orderId]: order.orderId });
                this.props.closeToast();
                await _database
                  .ref(`admin/${listing.adminId}/bookings`)
                  .update({ [order.orderId]: order.orderId });
                this.props.showTimedToast("Booking Successfull");
              } catch (e) {
                console.log(e);
              }
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}
