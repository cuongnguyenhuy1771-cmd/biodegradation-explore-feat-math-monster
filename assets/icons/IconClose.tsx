import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconClose = (props: SvgProps) => (
  <Svg
    width={42}
    height={43}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Rect
        width={40}
        height={40}
        x={1}
        fill="url(#b)"
        rx={20}
        shapeRendering="crispEdges"
      />
      <Path
        fill="#F9F9FB"
        d="M27.586 10.586a2 2 0 0 1 2.828 2.828L23.828 20l6.586 6.586a2 2 0 0 1-2.828 2.828L21 22.828l-6.586 6.586a2 2 0 1 1-2.828-2.828L18.172 20l-6.586-6.586a2 2 0 1 1 2.828-2.828L21 17.172l6.586-6.586Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={21}
        x2={21}
        y1={0}
        y2={40}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FE9985" />
        <Stop offset={1} stopColor="#FE5938" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconClose
