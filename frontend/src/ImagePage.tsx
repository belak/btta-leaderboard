import React, { useState, useCallback, useEffect } from "react";
import useAPIState from "./useAPIState";
import { useInterval } from "./utils";

function ImagePage({ onFinished }: { onFinished: () => void }) {
  const {
    state: { images },
  } = useAPIState();

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Preload all images
    images.map(({ image: src }) => {
      let image = new Image();
      image.src = src;
      return image;
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= offset) {
      onFinished();
    }
  }, [offset, images.length, onFinished]);

  const nextPage = useCallback(() => {
    setOffset(offset + 1);
  }, [offset, setOffset]);

  // Jump to the next page every 9 seconds
  const resetNextPage = useInterval(nextPage, 9000);

  useEffect(() => {
    // Keybinds have a unique effect on nextPage - they reset the timer which
    // automatically jumps to the next page. Without this, there is a strange
    // behavior where you can arrow through pages and it will look like 2 were
    // skipped at the same time.
    const keybindNextPage = () => {
      nextPage();
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
  }, [nextPage, resetNextPage]);

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
