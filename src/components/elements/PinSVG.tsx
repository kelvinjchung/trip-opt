import React from "react";

interface PinSVGProps {
  color?: string;
  num: number;
  height?: number;
  width?: number;
}

const PinSVG = ({
  color = "#000000",
  num,
  height = 30,
  width = 22.5,
}: PinSVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox="0 0 384 512"
      fill={color}
    >
      <path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z" />
      <text
        x="50%"
        y="45%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="200"
        fontWeight="bold"
      >
        {num}
      </text>
    </svg>
  );
};

export default PinSVG;
