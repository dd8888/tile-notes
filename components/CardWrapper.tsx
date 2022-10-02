import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { InitialValues } from "../utils/cardInitialValues";
import { Card } from "./Card";
export interface ICard {
  title: string;
  _id: string;
  initialPosition: {
    x: number;
    y: number;
    width: string | number;
    height: string | number;
  };
  text: string;
}
export const CardWrapper: React.FC = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const { isLoading: isLoadingCards, refetch: refetchCards } = useQuery(
    ["cards"],
    () => axios.get("/api/cards").then((response) => response.data),
    {
      onSuccess: (data) => {
        setCards(data);
      },
      //   refetchInterval: 1000,
    }
  );

  const addCardMutation = useMutation((): any => {
    return axios.post("/api/cards/new", {
      title: "New tile",
      initialPosition: {
        x: InitialValues.X,
        y: InitialValues.Y,
        height: InitialValues.HEIGHT,
        width: InitialValues.WIDTH,
      },
      text: "",
    });
  });

  const handleAddTile = async () => {
    await addCardMutation.mutateAsync();
    refetchCards();
  };
  const handleChangeName = (title: string, id: string) => {
    setCards((cards) => {
      return cards.map((card) => {
        return card._id === id ? { ...card, title } : card;
      });
    });
  };
  const handleChangeText = (text: string, id: string) => {
    setCards((cards) => {
      return cards.map((card) => {
        return card._id === id ? { ...card, text } : card;
      });
    });
  };

  return (
    <>
      <button
        className="z-1 bg-white rounded-md text-sm shadow-md p-2 font-medium absolute top-2 right-2"
        onClick={handleAddTile}
      >
        Add new tile
      </button>
      {!isLoadingCards && (
        <AnimatePresence>
          {cards.map((card, index) => {
            return (
              <motion.div
                key={card._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  id={card._id}
                  title={card.title}
                  textContent={card.text}
                  handleActive={() =>
                    setCards((cards) => [
                      ...cards.filter(
                        (cardFilter) => cardFilter._id !== card._id
                      ),
                      card,
                    ])
                  }
                  initialPosition={{
                    x: card.initialPosition.x,
                    y: card.initialPosition.y,
                    height: card.initialPosition.height,
                    width: card.initialPosition.width,
                  }}
                  handleChangeName={(name: string, id: string) =>
                    handleChangeName(name, id)
                  }
                  handleRemoveCard={(id: string) =>
                    setCards((cards) => cards.filter((card) => card._id !== id))
                  }
                  handleChangeText={(text: string, id: string) =>
                    handleChangeText(text, id)
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </>
  );
};
