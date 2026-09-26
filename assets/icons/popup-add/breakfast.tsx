import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const BreakFast = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#FF5630"
      fillRule="evenodd"
      d="M5.667 25.333a1 1 0 0 1 1-1h18.666a1 1 0 1 1 0 2H6.667a1 1 0 0 1-1-1Zm4 4a1 1 0 0 1 1-1h10.666a1 1 0 1 1 0 2H10.667a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
    <Path
      fill="#FF5630"
      d="M8.11 20.333a9 9 0 1 1 15.78 0h5.443a1 1 0 1 1 0 2H2.667a1 1 0 1 1 0-2H8.11Z"
    />
    <Path
      fill="#FF5630"
      fillRule="evenodd"
      d="M16 1.667a1 1 0 0 1 1 1V4a1 1 0 0 1-2 0V2.667a1 1 0 0 1 1-1ZM5.865 5.865a1 1 0 0 1 1.414 0l.524.524a1 1 0 0 1-1.414 1.414l-.524-.524a1 1 0 0 1 0-1.414Zm20.27 0a1 1 0 0 1 0 1.414l-.524.524a1 1 0 1 1-1.414-1.414l.524-.524a1 1 0 0 1 1.414 0ZM1.667 16a1 1 0 0 1 1-1H4a1 1 0 1 1 0 2H2.667a1 1 0 0 1-1-1ZM27 16a1 1 0 0 1 1-1h1.333a1 1 0 1 1 0 2H28a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default BreakFast
