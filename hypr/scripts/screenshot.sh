#!/bin/bash

# Current Theme
theme="$HOME/.config/rofi/screenshot.rasi"

# Options
all='󰍺'
display='󰍹'
window=''
selection='󰩭'

# Rofi CMD
rofi_cmd() {
  rofi -dmenu \
    -theme ${theme}
  }

# Pass variables to rofi dmenu
run_rofi() {
  echo -e "$all\n$display\n$window\n$selection" | rofi_cmd
}

# Actions
chosen="$(run_rofi)"
date="$(date +'Screenshot-%F-%H%M%S.png')"
save="$HOME/Pictures/Screenshots/${date}"

case ${chosen} in
  $all)
    geom=""
    selected=true
    ;;
  $display)
    geom=$(slurp -w 0 -o)
    ;;
  $window)
    workspaces="$(hyprctl monitors -j | jq -r '[(foreach .[] as $monitor (0; if $monitor.specialWorkspace.name == "" then $monitor.activeWorkspace else $monitor.specialWorkspace end)).id]')"
    windows="$(hyprctl clients -j | jq -r --argjson workspaces "$workspaces" 'map(select([.workspace.id] | inside($workspaces)))')"
    geom=$(echo "$windows" | jq -r '.[] | "\(.at[0]),\(.at[1]) \(.size[0])x\(.size[1])"' | slurp -w 0 -r)
    ;;
  $selection)
    geom=$(slurp -w 0 -d)
    ;;
esac

takescreenshot() {
  if [ -z "$geom" ] && [ $selected ]; then
    grim ${save}
  else
    grim -g "$geom" ${save}
  fi
}

takescreenshot
