import { Dispatch, useState } from "react";
import { InitialValues } from "../cardInitialValues";

export const useResizeCard = (setProperties: Dispatch<any>) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeFullScreen = () => {
    setProperties(() => {
      return {
        x: 0,
        y: 0,
        width: "99.5%",
        height: "98.5%",
      };
    });
    setIsResizing(true);
    setTimeout(() => setIsResizing(false), 700);
  };
  const resizeMinSize = () => {
    setProperties((properties: any) => {
      return {
        ...properties,
        width: InitialValues.WIDTH,
        height: InitialValues.HEIGHT,
      };
    });
    setIsResizing(true);
    setTimeout(() => setIsResizing(false), 700);
  };
  const resizeHalfRight = () => {
    setProperties(() => {
      return {
        width: window.innerWidth / 2,
        height: "98.5%",
        x: window.innerWidth / 2,
        y: InitialValues.Y,
      };
    });
    setIsResizing(true);
    setTimeout(() => setIsResizing(false), 700);
  };
  const resizeHalfLeft = () => {
    setProperties(() => {
      return {
        width: window.innerWidth / 2,
        height: "98.5%",
        x: InitialValues.X,
        y: InitialValues.Y,
      };
    });
    setIsResizing(true);
    setTimeout(() => setIsResizing(false), 700);
  };
  return {
    resizeMinSize,
    resizeFullScreen,
    resizeHalfRight,
    resizeHalfLeft,
    isResizing,
  };
};
