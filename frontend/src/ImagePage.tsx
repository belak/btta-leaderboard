import React, { useEffect } from "react";
import useAPIState from "./useAPIState";
import { isMobile, useInterval, useWindowSize } from "./utils";

function ImagePage({
  onFinished,
  onNextPage,
  page,
}: {
  onFinished: () => void;
  onNextPage: () => void;
  page: number;
}) {
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

  // Jump to the next page every 9 seconds
  const resetNextPage = useInterval(onNextPage, 9000);

  useEffect(() => {
    // Keybinds have a unique effect on nextPage - they reset the timer which
    // automatically jumps to the next page. Without this, there is a strange
    // behavior where you can arrow through pages and it will look like 2 were
    // skipped at the same time.
    const keybindNextPage = () => {
      onNextPage();
      resetNextPage();
    };

    Mousetrap.bind("space", keybindNextPage);
    Mousetrap.bind("enter", keybindNextPage);
    Mousetrap.bind("right", keybindNextPage);

    return () => {
      Mousetrap.unbind("space");
      Mousetrap.unbind("enter");
      Mousetrap.unbind("right");
    };
  }, [onNextPage, resetNextPage]);

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
}

export default ImagePage;
