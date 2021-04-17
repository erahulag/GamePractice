import { useDrag, DragPreviewImage } from "react-dnd";
import React from "react";
import { card_back } from "./card_images";

export const Draggable = ({
  children,
  disabled,
  type,
  meta_to_be_moved = {},
  previews = [],
}) => {
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    item: { type, meta_to_be_moved },
    canDrag: () => !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <>
      <DragPreviewImage src={card_back} connect={previewRef} />
      <div
        ref={dragRef}
        style={{
          opacity: isDragging ? 0.8 : 1,
        }}
      >
        {children}
      </div>
    </>
  );
};
