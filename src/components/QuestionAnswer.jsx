import React from "react";
import Answers from "./Answers";

const QuestionAnswer = ({index, item}) => {
  return (
    <>
      <div
        className={item.type === "q" ? "flex justify-end" : ""}
      >
        {item.type === "q" ? (
          <li
  className="
    text-right
    py-2 px-4
    w-fit
    max-w-[90%]
    md:max-w-[70%]
    break-words
    border-5
    dark:bg-zinc-700
    bg-gray-300
    border-zinc-300
    dark:border-zinc-700
    rounded-tl-3xl
    rounded-bl-3xl
    rounded-br-3xl
    dark:text-white
    text-black
  "
>
            <Answers
              ans={item.text}
              totalResult={1}
              index={index}
              type={item.type}
            />
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li 
            key={ansIndex}
            className="text-left p-1">
              <Answers
                ans={ansItem}
                totalResult={item.text.length}
                index={ansIndex}
                type={item.type}
              />
              
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;
