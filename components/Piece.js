import React from "react";
import {Icon} from "./Icon";
import {useDrag, useDrop} from "react-dnd";
import {useDispatch} from "react-redux";

export const pieceDimension = 60;

const Piece = ({ style, children, innerRef, ...props }) => {
  return (
    <div
      ref={innerRef}
      style={{
        ...style,
        display: "inline-block",
        borderRadius: "7px",
        width: pieceDimension - 1,
        height: pieceDimension - 1,
        padding: "10px",
        margin: "0.5px",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const PlaceholderPiece = ({ setPiece, outline }) => {
  const [, ref] = useDrop({
    accept: "all",
    canDrop(item, monitor) {
      return true;
    },
    drop(piece) {
      setPiece(piece);
    },
  });

  return (
    <Piece
      onClick={() => setPiece()}
      innerRef={ref}
      style={{
        borderColor: outline ? "black" : "transparent",
        borderWidth: "1px",
        borderStyle: "dashed",
        borderRadius: "20px",
      }}
    />
  );
};

export const DraggablePiece = ({piece, style, ...props}) => {
  const [{ opacity }, dragRef] = useDrag({
    item: {
      type: "all",
      ...piece
    },
    collect: (monitor) => {
      return {
        opacity: monitor.isDragging() ? 0 : 1,
      };
    },
  });

  const dispatch = useDispatch();

  return (
    <>
      <Piece
        innerRef={dragRef}
        style={{ backgroundColor: "black", opacity, ...style}}
        {...props}
      >
        <Icon {...piece} />
      </Piece>
    </>
  );
};

export const LayedPiece = ({piece, style, isNew, ...props}) => {
  return (
    <>
      <Piece style={{ backgroundColor: "black", ...style, ...(isNew ? {boxShadow: "0 0 20px -5px blue"}: {}) }} {...props}>
        <Icon {...piece} />
      </Piece>
    </>
  );
};
