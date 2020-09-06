import React from "react";

type ImagePageProps = {
  src: string;
};

function ImagePage({ src }: ImagePageProps) {
  return <img src={src} className={"fullscreenImage"} />;
}

export default ImagePage;
