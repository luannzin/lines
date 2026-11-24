# Hostline for Windows: downloads the latest release and puts it on your PATH. It keeps itself up
# to date from then on.
#   irm https://hostline.luannzin.com/install.ps1 | iex
# Served by hostline.luannzin.com (luannzin/lines, public/hostline/install.ps1).
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'  # the progress bar makes downloads crawl in Windows PowerShell 5.1
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$dir = Join-Path $env:LOCALAPPDATA 'Programs\Hostline'
$exe = Join-Path $dir 'hostline.exe'
New-Item -ItemType Directory -Force $dir | Out-Null
Write-Host 'Downloading Hostline...'
Invoke-WebRequest 'https://github.com/luannzin/hostline/releases/latest/download/hostline-windows-x86_64.exe' -OutFile "$exe.part"
Move-Item -Force "$exe.part" $exe

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not (($userPath -split ';') -contains $dir)) {
    [Environment]::SetEnvironmentVariable('Path', ((@($userPath, $dir) | Where-Object { $_ }) -join ';'), 'User')
    $env:Path += ";$dir"
}
Write-Host "Installed in $dir. It keeps itself up to date."
Write-Host 'Share a port: hostline 3000'
