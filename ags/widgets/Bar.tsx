import { App } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Mpris from "gi://AstalMpris"
import Battery from "gi://AstalBattery"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"
import Bluetooth from "gi://AstalBluetooth"
import { mediaVisible} from "./MediaPlayer"

function SysTray() {
    const tray = Tray.get_default()

    return <box className="SysTray">
        {bind(tray, "items").as(items => items.map(item => (
            <menubutton
                tooltipMarkup={bind(item, "tooltipMarkup")}
                usePopover={false}
                actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
                menuModel={bind(item, "menuModel")}>
                <icon gicon={bind(item, "gicon")} />
            </menubutton>
        )))}
    </box>
}

function Wifi() {
    const { wifi } = Network.get_default()

    return <button className="Wifi"
      onClicked={() => wifi.enabled = !wifi.enabled}>
      <icon
        tooltipText={bind(wifi, "enabled").as(e => e ? wifi.ssid : "")}
        icon={bind(wifi, "iconName")}
      />
    </button>
}

function BT() {
  const bluetooth = Bluetooth.get_default()
  const adapter = bluetooth.adapter
  const deviceConnected = Variable.derive(
    [bind(bluetooth, "devices"), bind(adapter, "powered")],
    (devices, powered) => {
      if (!powered) return ""
      for (const device of devices) {
        if (device.connected) return device.name
      }
      return "No device"
    })

  return <button
    className="Bluetooth"
    onClicked={() => bluetooth.toggle()}
  >
    <icon
      icon={bind(adapter, "powered").as(p => p ? "bluetooth" : "bluetooth-disabled")}
      tooltipText={deviceConnected()}
    />
  </button>
}

function AudioMute() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!

    return <button
        className="AudioMute"
        onClicked={() => speaker.mute = !speaker.mute}
    >
        <icon
            icon={bind(speaker, "volumeIcon")}
            tooltipText={bind(speaker, "volume").as(v =>
            `${Math.floor(v * 100)}% `
            )}
        />
    </button>
}

function BatteryLevel() {
    const bat = Battery.get_default()

    return <box className="Battery"
        visible={bind(bat, "isPresent")}>
        <icon
            icon={bind(bat, "batteryIconName")}
            tooltipText={bind(bat, "percentage").as(p =>
            `${Math.floor(p * 100)}% `
            )}
        />
    </box>
}

function Media() {
    const mpris = Mpris.get_default()

    return <box className="Media">
        {bind(mpris, "players").as(ps => ps[0] ? (
            <button
                onClicked={() => mediaVisible.set(!mediaVisible.get())}
            >
                <box>
                    <box
                        className="Cover"
                        valign={Gtk.Align.CENTER}
                        css={bind(ps[0], "coverArt").as(cover =>
                            `background-image: url('${cover}');`
                        )}
                    />
                    <label
                        label={bind(ps[0], "title").as(() =>
                            `${ps[0].title}`
                        )}
                    />
                </box>
            </button>
        ) : (
            "Nothing Playing"
        ))}
    </box>
}

function Workspaces() {
    const hypr = Hyprland.get_default()

    return <box className="Workspaces">
        {bind(hypr, "workspaces").as(wss => wss
            .sort((a, b) => a.id - b.id)
            .map(ws => (
                <button
                    className={bind(hypr, "focusedWorkspace").as(fw =>
                        ws === fw ? "focused" : "")}
                    onClicked={() => ws.focus()}
                >
                    {ws.id < 0 ? "S" : ws.id}
                </button>
            ))
        )}
    </box>
}

function Time({ format = "%H:%M - %d.%m.%Y" }) {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <label
        className="Time"
        onDestroy={() => time.drop()}
        label={time()}
    />
}

function KeyboardLayout() {
    const languages = {
        "English (US)": "us",
        "Slovak": "sk",
        "Hungarian": "hu",
    }
    const layout = Variable("")
        .observe(Hyprland.get_default(), "keyboard-layout", (_self, _keyboard, layout: string) => {
            for (const lang in languages) {
                if (layout.includes(lang)) {
                    return languages[lang]
                }
            }
            return "�"
        })

    return <label
        className="KeyboardLayout"
        label={layout()}
    />
}


export default function Bar(monitor: Gdk.Monitor) {
    const anchor = Astal.WindowAnchor.TOP
        | Astal.WindowAnchor.LEFT
        | Astal.WindowAnchor.RIGHT

    return <window
        className="Bar"
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}>
        <centerbox>
            <box hexpand halign={Gtk.Align.START}>
                <Workspaces />
            </box>
            <box>
                <Media />
            </box>
            <box hexpand halign={Gtk.Align.END} >
                <SysTray />
                <KeyboardLayout />
                <BT />
                <Wifi />
                <AudioMute />
                <BatteryLevel />
                <Time />
            </box>
        </centerbox>
    </window>
}
