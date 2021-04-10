import { useEffect } from "react";
import useAPIState from "./useAPIState";
import { isMobile, useNextPage, useWindowSize } from "./utils";

const ImagePage = ({
  onFinished,
  onNextPage,
  paused,
  page,
}: {
  onFinished: () => void;
  onNextPage: () => void;
  paused: boolean,
  page: number;
}) => {
  const {
    state: { images },
  } = useAPIState();

  const windowSize = useWindowSize();
  const onMobile = isMobile(windowSize);

  useEffect(() => {
    // Preload all images on desktop
    if (!onMobile) {
      images.map(({ image: src }) => {
        let image = new Image();
        image.src = src;
        return image;
      });
    }
  }, [images, onMobile]);

  const offset = images.length ? page % images.length : 0;

  useEffect(() => {
    if (images.length <= offset) {
      onFinished();
    }
  }, [offset, images.length, onFinished]);

  useNextPage(onNextPage, paused);

  const currentImage = images[offset];

  return (
    <div className="imageContainer">
      {currentImage && (
        <img
          src={currentImage.image}
          alt={currentImage.name}
          className="fullscreenImage"
        />
      )}
    </div>
  );
};

export default ImagePage;
