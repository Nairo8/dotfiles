local wezterm = require 'wezterm'
local config = wezterm.config_builder()
local color = wezterm.color.get_builtin_schemes()['nightfox']
local font =
  -- 'CaskaydiaCove Nerd Font'
  -- 'FiraCode Nerd Font'
  'JetBrainsMono Nerd Font'
local background = "nier_sword.png"
local default_prog

if wezterm.target_triple == "x86_64-pc-windows-msvc" then
  local win_home = os.getenv('USERPROFILE')
  default_prog = {'pwsh.exe', '-NoExit', '-NoLogo', '-File', win_home .. '\\.config\\Nairo.ps1'}
end

config = {

  --appearance
  background = {
    {
      source = {File=wezterm.config_dir .. "/background/" .. background},
      horizontal_align = "Center",
    },
    {
      source = {Color = color.background},
      height = '100%',
      width = '100%',
      opacity = 0.4,
    },
  },
  color_scheme = 'nightfox',
  default_prog = default_prog,
  enable_wayland = false,
  font = wezterm.font(font),
  font_size = 12.0,
  hide_mouse_cursor_when_typing = true,
  hide_tab_bar_if_only_one_tab = false,
  inactive_pane_hsb = {
    saturation = 0.9,
    brightness = 0.5,
  },
  show_tab_index_in_tab_bar = false,
  show_tabs_in_tab_bar = true,
  use_fancy_tab_bar = false,

  --behavior
  animation_fps = 60,
  max_fps = 60,
  exit_behavior = "Close",
  exit_behavior_messaging = "Verbose",
  scrollback_lines = 2000,
  switch_to_last_active_tab_when_closing_tab = true,
}

return config
