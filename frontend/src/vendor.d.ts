declare module "react-split-flap-effect" {
  const Presets: {
    NUM: String;
    ALPHANUM: String;
  };

  type FlapDisplayProps = {
    id?: String;
    css?: any;
    className?: String;
    value: String;
    chars?: String;
    words?: Array<String>,
    length: Number,
    padChar?: String,
    padMode?: 'auto' | 'start' | 'end',
    timing?: Number,
    hinge?: Boolean,
    // render?: any,
  };

  declare const FlapDisplay: React.ComponentType<FlapDisplayProps>;

  export { FlapDisplay, Presets };
}
