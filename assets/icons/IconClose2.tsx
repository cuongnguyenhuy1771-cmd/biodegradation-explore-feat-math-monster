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
const IconClose2 = (props: SvgProps) => (
  <Svg
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Rect width={48} height={48} fill="url(#b)" rx={20} />
      <Path
        fill="#F9F9FB"
        d="M30.586 14.586a2 2 0 1 1 2.828 2.828L26.828 24l6.586 6.586a2 2 0 0 1-2.828 2.828L24 26.828l-6.586 6.586a2 2 0 1 1-2.828-2.828L21.172 24l-6.586-6.586a2 2 0 1 1 2.828-2.828L24 21.172l6.586-6.586Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={24}
        x2={24}
        y1={0}
        y2={48}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#4B4A83" />
        <Stop offset={1} stopColor="#232242" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconClose2
