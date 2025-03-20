function dotfiles_cp{
    $source = "$env:USERPROFILE\.config\helix"
    $destination = "$env:USERPROFILE\Appdata\Roaming"
    Copy-Item -Path $source -Destination $destination -Recurse -Force
}
