import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { InitialValues } from "../utils/cardInitialValues";
import { useResizeCard } from "../utils/hooks/useResizeCard";

export const Card: React.FC<{
  title: string;
  handleActive: () => void;
  initialPosition: {
    x: number;
    y: number;
    width: string | number;
    height: string | number;
  };
}> = ({ title, handleActive, initialPosition }) => {
  const [properties, setProperties] = useState<{
    width?: any;
    height?: any;
    x: number;
    y: number;
  }>({
    x: InitialValues.X,
    y: InitialValues.Y,
    height: InitialValues.HEIGHT,
    width: InitialValues.WIDTH,
  });

  const {
    isResizing,
    resizeFullScreen,
    resizeMinSize,
    resizeHalfLeft,
    resizeHalfRight,
  } = useResizeCard(setProperties);
  return (
    <Rnd
      bounds="window"
      default={{
        height: InitialValues.HEIGHT,
        width: InitialValues.WIDTH,
        x: InitialValues.X,
        y: InitialValues.Y,
      }}
      onMouseDown={() => handleActive()}
      size={{ width: properties?.width, height: properties?.height }}
      position={{ x: properties?.x ?? 0, y: properties?.y ?? 0 }}
      onDragStop={(e, d) => {
        console.log(d);
        if (
          typeof window !== "undefined" &&
          d.x + properties.width === window.innerWidth
        ) {
          resizeHalfRight();
        } else if (d.x === 0) {
          resizeHalfLeft();
        } else {
          setProperties((properties) => {
            return { ...properties, x: d.x, y: d.y };
          });
        }
      }}
      disableDragging={properties?.width === "99.5%"}
      onResizeStop={(e, direction, ref, delta, position) => {
        setProperties({
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      minHeight={InitialValues.HEIGHT}
      minWidth={InitialValues.WIDTH}
      maxHeight="100%"
      maxWidth="100%"
      className={clsx(
        "bg-slate-200 rounded-md shadow-md bg-opacity-95 active:ring active:ring-blue-300 active:shadow-lg",
        isResizing && "transition-all duration-700"
      )}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.detail === 2) {
            resizeFullScreen();
          }
        }}
        className={clsx(
          "absolute top-0.5 z-10 truncate max-w-[70%] duration-700 text-white font-medium text-sm flex items-center gap-1",
          properties?.width === "99.5%" || parseInt(properties?.width) > 400
            ? "left-1/2 -translate-x-1/2"
            : "left-2 translate-x-0"
        )}
      >
        {title}
      </span>
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.detail === 2) {
            resizeFullScreen();
          }
        }}
        className="absolute top-0 right-0 h-6 rounded-t-md flex items-center justify-end p-2 gap-2 w-full bg-slate-600"
      >
        <PencilSquareIcon className="w-4 rounded-md h-4 bg-slate-200 p-0.5 cursor-pointer" />

        <ArrowsPointingInIcon
          className=" h-4 w-4 p-0.5 cursor-pointer rounded-full bg-red-400  text-white"
          onClick={() => {
            resizeMinSize();
          }}
        />
        <ArrowsPointingOutIcon
          className="h-4 w-4 p-0.5 cursor-pointer rounded-full bg-green-400 text-white"
          onClick={() => {
            resizeFullScreen();
          }}
        />
      </div>
    </Rnd>
  );
};
