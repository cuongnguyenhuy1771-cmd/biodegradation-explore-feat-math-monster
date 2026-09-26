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
const BadgeTitle = (props: SvgProps) => (
  <Svg viewBox="0 0 200 51" fill="none" {...props}>
    <G filter="url(#a)">
      <Path
        fill="url(#b)"
        d="M3.968 18.889C2.163 9.059 9.71 0 19.705 0h160.59c9.994 0 17.542 9.06 15.737 18.889l-2.937 16A16 16 0 0 1 177.358 48H22.642A16 16 0 0 1 6.905 34.889l-2.937-16Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={100}
        x2={100}
        y1={0}
        y2={48}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FDC42F" />
        <Stop offset={1} stopColor="#DB8900" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default BadgeTitle
