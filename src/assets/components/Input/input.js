import React from "react";
import Slider from "@material-ui/core/Slider";
import getCroppedImg from "../../../assets/resources/create-jpeg";
import Cropper from "react-easy-crop";
import Lottie from "react-lottie";

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
          <p>{props.title || "Click to upload Image"}</p>
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
        <p>{props.title || "Click to upload Image"}</p>
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
