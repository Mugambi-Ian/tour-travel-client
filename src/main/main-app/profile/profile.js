import React from "react";
import Slider from "@material-ui/core/Slider";
import getCroppedImg from "../../../assets/resources/create-jpeg";
import Cropper from "react-easy-crop";
import Lottie from "react-lottie";
import { validField, _auth, _database, _storage } from "../../../config";
import "./profile.css";

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
      customer = this.props.customer;
    }
    this.setState({ customer, loading: false });
  }

  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.customer.customerId + new Date().getTime();
    const uploadTask = _storage
      .ref("customers/")
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
    } else this.props.showTimedToast("All fields are required");
  }
  async syncUser() {
    var { customer } = this.state;
    this.setState({ loading: true });
    if (this.props.newUser)
      await _database.ref("customers/" + customer.customerId).set(customer);
    else
      await _database.ref("customers/" + customer.customerId).update(customer);
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

export const ImageUploader = (props) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [src, setSrc] = React.useState(props.src);
  const [updated, setUpdated] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [cropped, setCropped] = React.useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const aspect = 1 / 1;
  function onCropChange(crop) {
    setCrop(crop);
  }

  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function onZoomChange(zoom) {
    setZoom(zoom);
  }
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        setSrc(undefined);
        current.src = e.target.result;
        setUpdated(true);
        setImage(e.target.result);
        setCropped(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      props.updateValue(croppedImage);
      setImage(croppedImage);
      setSrc(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image, props]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none",
        }}
      />
      {updated === false && src === undefined ? (
        <div
          className="upload-img"
          onClick={() => imageUploader.current.click()}
        >
          <p>Click to upload Image</p>
          <div className="upload-anim">
            <Lottie
              ref={uploadedImage}
              options={{
                loop: true,
                autoplay: true,
                animationData: require("../../../assets/animations/mov-picture.json"),
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
      ) : cropped === false && src === undefined ? (
        <div className="crop-image-body">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => onZoomChange(zoom)}
            classes={{ container: "slider" }}
          />
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
          />
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "10vh",
              left: 0,
              right: 0,
              margin: "auto",
              alignSelf: "center",
              maxHeight: "40px",
              maxWidth: "500px",
            }}
            className="p-btns"
          >
            <div
              id="left"
              className="p-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await setTimeout(() => {
                  setCropped(false);
                  setImage(undefined);
                  setUpdated(false);
                  props.showField();
                }, 200);
              }}
            >
              <img
                //src={require("../../../assets/drawables/ic-close.png").default}
                alt=""
                draggable={false}
              />
              <p>Cancel</p>
            </div>
            <div
              className="p-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await showCroppedImage();
                await setTimeout(() => {
                  setCropped(true);
                  setUpdated(true);
                  props.showField();
                }, 200);
              }}
            >
              <img
                // src={require("../../../assets/drawables/ic-crop.png").default}
                alt=""
                draggable={false}
              />
              <p>Crop</p>
            </div>
          </div>
        </div>
      ) : src || props.src ? (
        <img
          ref={uploadedImage}
          alt=""
          className="img-upload unselectable"
          draggable={false}
          src={image ? image : props.src}
          onClick={async () => {
            await setTimeout(() => {
              imageUploader.current.click();
            }, 200);
          }}
        />
      ) : (
        <div
          className="upload-img"
          onClick={() => imageUploader.current.click()}
        >
          <p>Click to upload Image</p>
          <div className="upload-anim">
            <Lottie
              ref={uploadedImage}
              options={{
                loop: true,
                autoplay: true,
                animationData: require("../../../assets/animations/mov-picture.json"),
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export class EditInput extends React.Component {
  render() {
    return (
      <div className="p-input">
        <p>{this.props.name}</p>
        <input
          rows="12"
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          required
          onChange={(e) => {
            this.props.onChange(e);
          }}
          value={this.props.value}
        />
      </div>
    );
  }
}

export class TextArea extends React.Component {
  render() {
    return (
      <div className="p-input">
        <p>{this.props.name}</p>
        <textarea
          rows="12"
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          required
          onChange={(e) => {
            this.props.onChange(e);
          }}
          value={this.props.value}
        />
      </div>
    );
  }
}
