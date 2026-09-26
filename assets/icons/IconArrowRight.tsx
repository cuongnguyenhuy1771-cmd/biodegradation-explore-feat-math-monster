import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconArrowLeft = (props: SvgProps) => (
  <Svg
    width={30}
    height={48}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Path
        fill="url(#b)"
        d="M27.938 29.577c2.75-3.192 2.75-7.962 0-11.154L14.568 2.9C9.51-2.972 0 .67 0 8.478v31.044c0 7.81 9.51 11.45 14.569 5.577l13.37-15.522Z"
      />
    </G>
    <G filter="url(#c)">
      <Path
        fill="#F9F9FB"
        d="M10.496 14.666a2 2 0 0 1 2.828 0l6.52 6.52a3.986 3.986 0 0 1 0 5.628l-6.52 6.52a2 2 0 0 1-2.828-2.828L17 24l-6.505-6.506a2 2 0 0 1 0-2.828Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={15}
        x2={15}
        y1={0}
        y2={48}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FFD65C" />
        <Stop offset={1} stopColor="#FFB922" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconArrowLeft
