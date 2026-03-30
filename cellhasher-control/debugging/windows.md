# Windows

Use the script below to collect system info needed for debugging Cellhasher Control on Windows.

## System Info Script

Run the following script in **PowerShell** and paste the output when reporting an issue:

```powershell
$lines = [System.Collections.Generic.List[string]]::new()

function section($title) { $script:lines.Add(""); $script:lines.Add("=== $title ===") }
function append($line)   { $script:lines.Add($line) }

section "OS INFO"
$os = Get-CimInstance Win32_OperatingSystem
append "OS Name: $($os.Caption)"
append "OS Version: $($os.Version)"
append "Build: $($os.BuildNumber)"

section "ARCHITECTURE"
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$archMap = @{0="x86"; 5="ARM"; 9="x64"; 12="ARM64"}
$archName = if ($archMap.ContainsKey([int]$cpu.Architecture)) { $archMap[[int]$cpu.Architecture] } else { "$($cpu.Architecture)" }
append "CPU Architecture: $archName"
append "OS Bitness: $(if ([Environment]::Is64BitOperatingSystem) { '64-bit' } else { '32-bit' })"
append "Process Bitness: $(if ([Environment]::Is64BitProcess) { '64-bit' } else { '32-bit (WOW64)' })"

section "ADB CHECK"
$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
    append "ADB installed: Yes"
    append "ADB path: $($adb.Source)"
    $adbVer = adb version 2>$null | Select-Object -First 1
    append "ADB version: $adbVer"
} else {
    append "ADB installed: No"
}

section "WINDOWS SUBSYSTEM"
$wsl = Get-Command wsl -ErrorAction SilentlyContinue
append "WSL available: $(if ($wsl) { 'Yes' } else { 'No' })"

$output = $lines -join "`n"
Write-Host "=== COPY BELOW ===`n------------------`n$output`n------------------"
```

Copy the output from the `=== COPY BELOW ===` block and include it with your support request.
