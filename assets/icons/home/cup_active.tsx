import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const CupActive = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#22C55E"
      d="M1.655 5.844C1.027 2.83 3.328 0 6.407 0h17.186c3.079 0 5.38 2.83 4.752 5.844L24.3 25.261a4.854 4.854 0 0 1-4.752 3.864h-9.096A4.854 4.854 0 0 1 5.7 25.261L1.655 5.844Z"
    />
  </Svg>
)
export default CupActive
