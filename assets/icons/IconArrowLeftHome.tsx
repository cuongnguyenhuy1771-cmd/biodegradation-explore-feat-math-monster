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
const IconArrowLeftHome = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Rect width={40} height={40} fill="url(#b)" rx={20} />
      <Path
        fill="#F9F9FB"
        d="M16.156 12.516a2 2 0 0 1 2.828 2.828l-4.656 4.655 4.656 4.656a2 2 0 0 1-2.828 2.83l-6.07-6.07a2 2 0 0 1 0-2.829l6.07-6.07Z"
      />
      <Path
        fill="#F9F9FB"
        d="M28.5 18a2 2 0 0 1 0 4H11.67a2 2 0 0 1 0-4H28.5Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={20}
        x2={20}
        y1={0}
        y2={40}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#4B4A83" />
        <Stop offset={1} stopColor="#232242" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconArrowLeftHome
