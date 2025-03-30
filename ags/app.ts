import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widgets/Bar"
import OSD from "./widgets/OSD"

const windows = [
  Bar,
  OSD,
]

App.start({
    css: style,
    main() {
      windows.map((windows) => App.get_monitors().map(windows))
    },
})
