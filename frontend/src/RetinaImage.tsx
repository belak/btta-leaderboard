import React from "react";

import { isHiDpi } from "./utils";

type RetinaImageProps = {
  alt: string;
  src: string;
};

function RetinaImage({ alt, src }: RetinaImageProps) {
  const split = src.split('.');
  const ext = split.pop();
  const baseName = split.join('.');

  let imgSrc = src;
  if (ext && isHiDpi()) {
    imgSrc = `${baseName}@2x.${ext}`
  }

  return <img alt={alt} src={imgSrc} />;
}

export default RetinaImage;
