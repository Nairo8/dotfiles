#!/bin/bash

## Author : Aditya Shakya (adi1090x)
## Github : @adi1090x
#
## Rofi   : Power Menu

# Current Theme
theme="$HOME/.config/rofi/powermenu.rasi"

# CMDs
uptime="`uptime -p | sed -e 's/up //g'`"

# Options
shutdown='󰐥'
reboot='󰜉'
suspend='󰤄'
logout='󰍃'

# Rofi CMD
rofi_cmd() {
  rofi -dmenu \
    -p "Goodbye ${USER}" \
    -mesg "Uptime: $uptime" \
    -theme ${theme}
  }

# Pass variables to rofi dmenu
run_rofi() {
  echo -e "$suspend\n$logout\n$reboot\n$shutdown" | rofi_cmd
}

# Actions
chosen="$(run_rofi)"
case ${chosen} in
  $shutdown)
    systemctl poweroff
    ;;
  $reboot)
    systemctl reboot
    ;;
  $suspend)
    systemctl suspend
    ;;
  $logout)
    hyprctl dispatch exit 0
    ;;
esac
