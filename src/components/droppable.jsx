import React from "react";
import { useDrop } from "react-dnd";
export const Droppable = ({ disabled, children, handleMove }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "card",
    canDrop: () => !disabled,
    drop: (item) => handleMove && handleMove(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  return (
    <div
      ref={dropRef}
      className={"droppable-area"}
      style={{
        "background-color": canDrop
          ? `rgba(0,255,0,${isOver ? 0.3 : 0.2})`
          : "inherit",
      }}
    >
      {children}
    </div>
  );
};
