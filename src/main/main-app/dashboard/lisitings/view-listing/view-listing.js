import React from "react";
import MyDictionary from "../../../../../assets/resources/my-dictionary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./view-listing.css";
import { formatNumber } from "../../../../../config";

function CloseBtn(props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        maxHeight: "40px",
        justifyContent: "flex-end",
        marginBottom: "-40px",
      }}
    >
      <img
        onClick={async () => {
          await setTimeout(() => {
            props.onClick();
          }, 200);
        }}
        className="el-close-btn"
        alt=""
        src={require("../../../../../assets/drawables/ic-cancel.png").default}
      />
    </div>
  );
}
export default class ViewListing extends React.Component {
  state = {
    listing: this.props.listing,
    currentScreen: 1,
    processOrder: false,
  };

  render() {
    const { listing, currentScreen, processOrder } = this.state;
    const update = (x) => {
      this.setState({ ...x });
    };
    const total =
      processOrder.total *
      (processOrder.endDate
        ? Math.round(
            (processOrder.endDate - processOrder.startDate) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 1);
    return (
      <div className="el-body">
        <div className={`el-form s4`}>
          <div className="el-content">
            <CloseBtn onClick={this.props.closeProcess.bind(this)} />
            <h1>{listing.name}</h1>
            <div className="el-overview">
              <div className="lo-nav">
                <img src={listing.listingDp} alt="" />
                <p
                  className={currentScreen === 1 ? "on" : ""}
                  onClick={async () =>
                    await setTimeout(() => {
                      if (currentScreen !== 1)
                        this.setState({ currentScreen: 1 });
                    }, 200)
                  }
                >
                  Overview
                </p>
                <p
                  className={currentScreen === 2 ? "on" : ""}
                  onClick={async () =>
                    await setTimeout(() => {
                      if (currentScreen !== 2)
                        this.setState({
                          currentScreen: 2,
                          processOrder: false,
                          listing: { ...listing, order: new MyDictionary() },
                        });
                    }, 200)
                  }
                >
                  Book
                </p>
              </div>
              <div className="lo-content">
                {currentScreen === 1 ? (
                  <div className="overview s1">
                    <div className="lo-description">
                      {listing.description.split("\n").map((x, i) => {
                        return <p>{x}</p>;
                      })}
                    </div>
                    <div className="gallery">
                      {listing.listingPhotos.map((x, i) => {
                        return <img src={x} class="gallery__img" alt="" />;
                      })}
                    </div>
                  </div>
                ) : processOrder ? (
                  <div className="overview s1">
                    <p>Select your tour dates</p>
                    <div className="when-div">
                      <div className="time">
                        <p className="unselectable">Starting On:</p>
                        <div>
                          <DatePicker
                            placeholderText="Start Date"
                            minDate={new Date()}
                            selected={
                              processOrder.startDate
                                ? processOrder.startDate
                                : null
                            }
                            onChange={(e) => {
                              processOrder.startDate = e;
                              update({ processOrder });
                            }}
                          />
                        </div>
                      </div>
                      <div className="time">
                        <p className="unselectable">Ending On:</p>
                        <div>
                          <DatePicker
                            placeholderText="End Date"
                            minDate={processOrder.startDate || new Date()}
                            selected={
                              processOrder.endDate ||
                              processOrder.startDate ||
                              null
                            }
                            onChange={(e) => {
                              console.log(e);
                              processOrder.endDate = e;
                              update({ processOrder });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <h2>
                      Total: Kes
                      {" " + formatNumber(total)} /=
                    </h2>{" "}
                    <p
                      onClick={async () =>
                        await setTimeout(async () => {
                          if (total > 0)
                            this.props.bookListing(
                              processOrder,
                              listing,
                              total
                            );
                          else this.props.showTimedToast("Invalid Dates");
                        }, 200)
                      }
                      className="p-btn"
                    >
                      Proceed
                    </p>
                  </div>
                ) : (
                  <div className="overview">
                    <p>Charges per day</p>
                    <div className="el-pricing-list">
                      {listing.pricing.map((p, i) => {
                        listing.order = listing.order || new MyDictionary();
                        p.orderQty = listing.order.get(i)
                          ? listing.order.get(i).orderQty
                          : 0;
                        return (
                          <div className="price-card">
                            <p>{p.category}</p>
                            <p>Kes {p.price}.00 /= </p>
                            <div className="qty-div">
                              <p className="unselectable">Quantity</p>
                              <div className="qty-crtl">
                                <p
                                  className="unselectable"
                                  onClick={async () => {
                                    await setTimeout(() => {
                                      p.orderQty = p.orderQty - 1;
                                      p.orderQty =
                                        p.orderQty < 0 ? 0 : p.orderQty;
                                      listing.order.set(i, p.orderQty);
                                      update(listing);
                                    }, 200);
                                  }}
                                >
                                  -
                                </p>
                                <input
                                  value={p.orderQty}
                                  onChange={(x) => {
                                    x = x.target.value;
                                    p.orderQty = parseInt(x) || 0;
                                    p.orderQty =
                                      p.orderQty < 0 ? 0 : p.orderQty;
                                    listing.order.set(i, p.orderQty);
                                    update({ listing });
                                  }}
                                />
                                <p
                                  className="unselectable"
                                  onClick={async () => {
                                    await setTimeout(() => {
                                      p.orderQty = p.orderQty + 1;
                                      listing.order.set(i, p);
                                      update(listing);
                                    }, 200);
                                  }}
                                >
                                  +
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p
                      onClick={async () =>
                        await setTimeout(() => {
                          if (listing.order) {
                            const x = listing.order.listKeys();
                            const order = [];
                            let total = 0;
                            for (let i = 0; i < x.length; i++) {
                              const y = x[i];
                              const z = listing.order.get(y);
                              if (z.orderQty > 0) {
                                total = z.orderQty * z.price + total;
                                order.push({
                                  orderQty: z.orderQty,
                                  unitPrice: z.price,
                                  category: z.category,
                                });
                              }
                            }
                            if (order.length === 0) {
                              this.props.showTimedToast("Place items to cart");
                            } else {
                              this.setState({
                                processOrder: {
                                  order,
                                  total,
                                  startDate: new Date(),
                                  endDate: new Date(),
                                },
                              });
                            }
                          }
                        }, 200)
                      }
                      className="p-btn"
                    >
                      Proceed
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
