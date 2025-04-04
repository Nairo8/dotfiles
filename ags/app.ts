import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widgets/Bar"
import OSD from "./widgets/OSD"
import MediaControl from "./widgets/MediaPlayer"

const windows = [
  Bar,
  OSD,
  MediaControl,
]

App.start({
    css: style,
    main() {
      windows.map((windows) => App.get_monitors().map(windows))
    },
})
