import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Lunch = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#FFAB00"
      d="M22.667 16a6.667 6.667 0 1 1-13.334 0 6.667 6.667 0 0 1 13.334 0Z"
    />
    <Path
      fill="#FFAB00"
      fillRule="evenodd"
      d="M16 1.667a1 1 0 0 1 1 1v2.666a1 1 0 1 1-2 0V2.667a1 1 0 0 1 1-1ZM4.892 4.955a1 1 0 0 1 1.412-.063L9.267 7.6a1 1 0 1 1-1.35 1.476L4.956 6.368a1 1 0 0 1-.063-1.413Zm22.216 0a1 1 0 0 1-.063 1.413l-2.962 2.708a1 1 0 1 1-1.35-1.476l2.963-2.708a1 1 0 0 1 1.412.063ZM1.668 16a1 1 0 0 1 1-1h2.666a1 1 0 1 1 0 2H2.667a1 1 0 0 1-1-1Zm24 0a1 1 0 0 1 1-1h2.666a1 1 0 1 1 0 2h-2.666a1 1 0 0 1-1-1ZM22.7 22.7a1 1 0 0 1 1.414 0l2.963 2.963a1 1 0 0 1-1.415 1.415l-2.962-2.964a1 1 0 0 1 0-1.414ZM9.3 22.7a1 1 0 0 1 0 1.415l-2.963 2.963a1 1 0 0 1-1.415-1.415L7.885 22.7a1 1 0 0 1 1.415 0Zm6.7 2.967a1 1 0 0 1 1 1v2.666a1 1 0 1 1-2 0v-2.666a1 1 0 0 1 1-1Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default Lunch
