import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { isWebpSupported } from "react-image-webp/dist/utils";
import {
  autoSizeImage,
  horizontalOverflow,
  showHelpText,
  mediaCarousel,
  darkMediaCarousel
} from "../stylesheets/components/MediaCarousel.module.sass";

const mediaCarouselText = require("../data/mediaCarousel");

const IS_WEBP_SUPPORTED = isWebpSupported();
const getImageLinkWithExtension = imageLink => {
  if (IS_WEBP_SUPPORTED && imageLink.endsWith(".png")) {
    return `${imageLink.substring(0, imageLink.length - 4)}.webp`;
  }
  return imageLink;
};

const MediaCarousel = ({ folder, images, isDark }) => {
  // detect if the user is coming from an iOS device and show help text instead of scroll bar
  // because mobile safari doesn't show scroll bars
  const iOS =
    !!window.navigator.userAgent.match(/iPad/i) || !!window.navigator.userAgent.match(/iPhone/i);

  const [imageLoaded, setImageLoaded] = useState([]);

  const hasMultipleImagesAndiOS = () => {
    return iOS && imageLoaded.length > 1;
  };
  useEffect(() => {
    const imageLinkWithExtension = imageFileName => {
      return `data/images/blog/${folder}/${getImageLinkWithExtension(imageFileName)}`;
    };
    images.split(",").map(imageFileName =>
      import(`../${imageLinkWithExtension(imageFileName)}`).then(imageLink => {
        setImageLoaded(oldArray => [...oldArray, imageLink.default]);
      })
    );
  }, [folder, images]);

  return (
    <>
      <div
        align="center"
        className={`${horizontalOverflow} ${isDark ? darkMediaCarousel : null} ${mediaCarousel} ${
          hasMultipleImagesAndiOS() ? "pt-3 pb-0 mt-3 mb-1" : "py-3 my-3"
        }`}
      >
        {imageLoaded
          ? imageLoaded.map((imageRelativeLink, index) =>
              imageRelativeLink.endsWith(".mp4") ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  className={`${autoSizeImage} ${index > 0 && "ml-1"}`}
                  loop
                  autoPlay
                  playsinline
                  muted
                  // will enable video controls on iOS devices with mobile
                  // safari so users can still play videos
                  controls={iOS}
                  key={imageRelativeLink}
                >
                  <source src={imageRelativeLink} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={imageRelativeLink}
                  className={`${autoSizeImage} ${index > 0 && "ml-1"}`}
                  alt={imageRelativeLink}
                  key={imageRelativeLink}
                />
              )
            )
          : null}
      </div>
      {hasMultipleImagesAndiOS() ? (
        <span className={`d-flex justify-content-center pb-3 ${showHelpText}`}>
          {mediaCarouselText.mediaCarouselHelpText}
        </span>
      ) : null}
    </>
  );
};

MediaCarousel.propTypes = {
  folder: PropTypes.string.isRequired,
  images: PropTypes.string.isRequired,
  isDark: PropTypes.bool
};

MediaCarousel.defaultProps = {
  isDark: false
};

export default MediaCarousel;