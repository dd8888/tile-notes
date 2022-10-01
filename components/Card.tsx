import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { InitialValues } from "../utils/cardInitialValues";
import { useResizeCard } from "../utils/hooks/useResizeCard";

export const Card: React.FC<{
  title: string;
  id: string;
  handleActive: () => void;
  initialPosition: {
    x: number;
    y: number;
    width: string | number;
    height: string | number;
  };
  handleChangeName: (name: string, id: string) => void;
  handleRemoveCard: (id: string) => void;
}> = ({
  title,
  handleActive,
  initialPosition,
  id,
  handleChangeName,
  handleRemoveCard,
}) => {
  const [properties, setProperties] = useState<{
    width?: any;
    height?: any;
    x: number;
    y: number;
  }>({
    x: initialPosition.x,
    y: initialPosition.y,
    height: initialPosition.height,
    width: initialPosition.width,
  });

  const {
    isResizing,
    resizeFullScreen,
    resizeMinSize,
    resizeHalfLeft,
    resizeHalfRight,
  } = useResizeCard(setProperties);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const titleRef = useRef<any>(null);
  return (
    <Rnd
      bounds="window"
      default={{
        height: InitialValues.HEIGHT,
        width: InitialValues.WIDTH,
        x: InitialValues.X,
        y: InitialValues.Y,
      }}
      onMouseDown={(e) => {
        console.log(e.target);
        handleActive();
      }}
      size={{ width: properties?.width, height: properties?.height }}
      position={{ x: properties?.x ?? 0, y: properties?.y ?? 0 }}
      onDragStop={(e, d) => {
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
      <input
        size={title.length}
        ref={titleRef}
        disabled={!isTitleEditable}
        onBlur={() => setIsTitleEditable(false)}
        onChange={(e) => handleChangeName(e.target.value, id)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        className={clsx(
          "outline-none bg-transparent absolute top-0.5 z-10 truncate text-white font-medium text-sm text-start",
          properties?.width === "99.5%" || parseInt(properties?.width) > 400
            ? "left-1/2 -translate-x-1/2 max-w-[60%]"
            : "left-2 translate-x-0 max-w-[50%]"
        )}
        value={title}
      />
      <div
        onClick={(e) => {
          if (e.detail === 2) {
            resizeFullScreen();
          }
        }}
        className="absolute top-0 right-0 h-6 rounded-t-md flex items-center justify-end p-2 gap-2 w-full bg-slate-600"
      >
        <div id={`edit-${id}`} onClick={(e) => {}}>
          <PencilSquareIcon
            className="w-4 rounded-md h-4 bg-slate-200 p-0.5 cursor-pointer"
            onClick={(e) => {
              setIsTitleEditable(true);
              setTimeout(() => {
                titleRef!.current!.focus();
                titleRef!.current!.select();
              }, 100);
            }}
          />
        </div>
        <ArrowsPointingInIcon
          className=" h-4 w-4 p-0.5 cursor-pointer rounded-full bg-yellow-400  text-white"
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
        <XMarkIcon
          className="h-4 w-4  cursor-pointer rounded-full bg-red-600 text-white"
          onClick={() => {
            handleRemoveCard(id);
          }}
        />
      </div>
    </Rnd>
  );
};
