import React from "react";
import Lottie from "react-lottie";
import { formatNumber } from "../../../../config";
import "./bookings.css";

export default class Bookings extends React.Component {
  getDate(x) {
    try {
      x = x.split("_");
      const monthNames = [
        "_",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${x[2]} ${monthNames[x[1]]}, ${x[0]}`;
    } catch (error) {
      return "";
    }
  }

  bookingCard(d, i) {
    console.log(d);
    let { startDate, endDate, admin } = d;
    const listing = this.props.listings.get(d.listingId);
    startDate = this.getDate(startDate);
    endDate = this.getDate(endDate);
    return (
      <div className="book-card">
        <p className="date">From: {startDate}</p>
        <p className="date">To: {endDate}</p>
        <h1>{listing.name}</h1>
        <div className="customer">
          <h4>By: {admin.fullName}</h4>
          {admin.adminDp ? <img alt="" src={admin.adminDp} /> : ""}
        </div>
        <div className="customer">
          <h4>Total: KES {formatNumber(d.total)} /= </h4>
        </div>
        {d.order.map((d, i) => {
          return (
            <div className="info">
              <p>{d.category}</p>
              <p>{d.unitPrice}</p>
              <p>{d.orderQty}</p>
            </div>
          );
        })}
        <h5>Email :{admin.email}</h5>
        <h5>Phone Number :{admin.phoneNumber}</h5>
      </div>
    );
  }
  render() {
    const { bookings } = this.props;
    return (
      <div className="booking-body">
        {bookings.listKeys().length === 0 ? (
          <div className="no-bookings">
            <div id="animation">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: require("../../../../assets/animations/mov-start.json"),
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
              />
            </div>
            <p className="unselectable">Wait For Customers</p>
          </div>
        ) : (
          <ol className="bookings-list">
            {bookings.getVaules().map((d, i) => {
              return this.bookingCard(d, i);
            })}
            <div style={{ minHeight: "100px" }} />
          </ol>
        )}
      </div>
    );
  }
}
