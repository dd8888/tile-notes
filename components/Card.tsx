import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PencilIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Rnd } from "react-rnd";
import { InitialValues } from "../utils/cardInitialValues";
import { useResizeCard } from "../utils/hooks/useResizeCard";
import { MdEditorComp } from "./MdEditor";
interface Position {
  x: number;
  y: number;
  width: string | number;
  height: string | number;
}

export const Card: React.FC<{
  title: string;
  id: string;
  handleActive: () => void;
  initialPosition: Position;
  handleChangeName: (name: string, id: string) => void;
  handleChangeText: (text: string, id: string) => void;
  handleRemoveCard: (id: string) => void;
  textContent: string;
}> = ({
  title,
  handleActive,
  initialPosition,
  id,
  handleChangeName,
  handleChangeText,
  handleRemoveCard,
  textContent,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const updateCardMutation = useMutation(({ card }: { card: any }): any => {
    return axios.post("/api/cards", card);
  });
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
  const isWide = useMemo(() => {
    return parseInt(properties?.width) > 400 || properties.width === "99.5%";
  }, [properties.width]);
  return (
    <Rnd
      bounds="window"
      default={{
        height: InitialValues.HEIGHT,
        width: InitialValues.WIDTH,
        x: InitialValues.X,
        y: InitialValues.Y,
      }}
      onMouseDown={() => {
        handleActive();
      }}
      size={{ width: properties?.width, height: properties?.height }}
      position={{ x: properties?.x ?? 0, y: properties?.y ?? 0 }}
      onDragStop={(e, d) => {
        if (
          typeof window !== "undefined" &&
          d.x + parseInt(properties.width) === window.innerWidth
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
        "parent overflow-hidden bg-slate-200 rounded-md shadow-md bg-opacity-95",
        isResizing && "transition-all duration-700"
      )}
    >
      <div
        className="h-full"
        onMouseDown={(e) => isWide && isEditable && e.stopPropagation()}
      >
        <MdEditorComp
          view={{
            html: true,
            md: isEditable && isWide,
            menu: isEditable && isWide,
          }}
          handleValueChange={(text: string) => handleChangeText(text, id)}
          value={textContent}
        />
      </div>

      <input
        size={title.length}
        ref={titleRef}
        disabled={!isTitleEditable}
        onBlur={() => {
          setIsTitleEditable(false);
          updateCardMutation.mutate({ card: { _id: id, title } });
        }}
        onChange={(e) => handleChangeName(e.target.value, id)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        className={clsx(
          "transition-all duration-700 outline-none bg-transparent absolute top-0.5 z-10 truncate text-white font-medium text-sm text-start",
          isWide
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
          className="h-4 w-4 p-0.5 cursor-pointer rounded-full bg-red-600 text-white "
          onClick={() => {
            handleRemoveCard(id);
          }}
        />
      </div>
      <div
        className={clsx(
          "flex items-center justify-center rounded-full p-1  h-6 w-6 absolute right-0 shadow-sm -translate-x-1/2 cursor-pointer transition-all duration-300 bottom-2",
          isEditable ? "bg-red-600" : "bg-slate-200"
        )}
      >
        {!isEditable && (
          <PencilIcon
            className={clsx("w-6 h-6 ")}
            onClick={() => {
              !isWide && resizeFullScreen();
              setIsEditable(true);
            }}
          />
        )}
        {isEditable && (
          <XMarkIcon
            className={clsx("w-6 h-6 text-white")}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditable(false);
            }}
          />
        )}
      </div>
    </Rnd>
  );
};
