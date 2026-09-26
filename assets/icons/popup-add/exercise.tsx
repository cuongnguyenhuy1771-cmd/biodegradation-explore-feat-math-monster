import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Exercise = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#FFAB00"
      d="M22.907 7c-2.28 0-5 .867-5 5v8c0 4.133 2.72 5 5 5s5-.867 5-5v-8c0-4.133-2.72-5-5-5ZM9.093 7c-2.28 0-5 .867-5 5v8c0 4.133 2.72 5 5 5s5-.867 5-5v-8c0-4.133-2.72-5-5-5ZM17.907 15h-3.814v2h3.814v-2ZM30 20.333c-.547 0-1-.453-1-1v-6.666c0-.547.453-1 1-1 .547 0 1 .453 1 1v6.666c0 .547-.453 1-1 1ZM2 20.333c-.547 0-1-.453-1-1v-6.666c0-.547.453-1 1-1 .547 0 1 .453 1 1v6.666c0 .547-.453 1-1 1Z"
    />
  </Svg>
)
export default Exercise
