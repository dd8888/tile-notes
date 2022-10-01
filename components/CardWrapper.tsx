import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { InitialValues } from "../utils/cardInitialValues";
import { Card } from "./Card";

export const CardWrapper: React.FC = () => {
  const [cards, setCards] = useState<{ title: string; id: string }[]>([]);

  //   const hanleInitialPosition = (index: number) => {
  //     const t = index % 4;
  //     return {
  //       x:
  //         typeof window !== "undefined"
  //           ? (window.innerWidth / 8) * t + window.innerWidth / 72
  //           : 0,
  //       y:
  //         (InitialValues.HEIGHT / 2) * Math.floor(index / 4) +
  //         (InitialValues.HEIGHT / 1.5) * Math.floor(index / 4) +
  //         10,
  //       width: "20%",
  //       height: InitialValues.HEIGHT,
  //     };
  //   };
  const handleAddTile = () => {
    setCards((cards) => [...cards, { title: "New tile", id: uuidv4() }]);
  };
  return (
    <>
      <button
        className="z-1 bg-white rounded-md text-sm shadow-md p-2 font-medium absolute top-2 right-2"
        onClick={handleAddTile}
      >
        Add new tile
      </button>
      <AnimatePresence>
        {cards.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card
                title={card.title}
                handleActive={() =>
                  setCards((cards) => [
                    ...cards.filter((cardFilter) => cardFilter.id !== card.id),
                    card,
                  ])
                }
                initialPosition={{
                  x: InitialValues.X,
                  y: InitialValues.Y,
                  height: InitialValues.HEIGHT,
                  width: InitialValues.WIDTH,
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
};
