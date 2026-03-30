# Linux

Use the script below to collect system info needed for debugging Cellhasher Control on Linux.

## System Info Script

Run the following script in a terminal and paste the output when reporting an issue:

```bash
#!/usr/bin/env bash

# Collect output in a variable
out=""

section() {
    out+="\n=== $1 ===\n"
}

append() {
    out+="$1\n"
}

section "DISPLAY"
append "Display protocol: ${XDG_SESSION_TYPE:-Unknown}"

section "OS INFO"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    append "OS Name: $NAME"
    append "OS ID: $ID"
    append "OS Version: $VERSION"
    append "OS Version ID: $VERSION_ID"
    append "OS Codename: ${VERSION_CODENAME:-N/A}"
else
    append "/etc/os-release not found"
fi

section "ARCHITECTURE"
kernel_arch=$(uname -m)
append "Kernel architecture: $kernel_arch"

cpu_arch=$(lscpu 2>/dev/null | awk -F: '/Architecture/ {print $2}' | xargs)
append "CPU architecture: ${cpu_arch:-Unknown}"

userland_bits=$(file /usr/bin/bash | grep -oE "32-bit|64-bit")
append "Userland bitness: ${userland_bits:-Unknown}"

if [[ "$userland_bits" == "64-bit" ]]; then
    append "OS Bitness: 64-bit"
elif [[ "$userland_bits" == "32-bit" ]]; then
    append "OS Bitness: 32-bit"
else
    append "OS Bitness: Unknown"
fi

section "ADB CHECK"
if command -v adb >/dev/null 2>&1; then
    adb_path=$(command -v adb)
    append "ADB installed: Yes"
    append "ADB path: $adb_path"
    adb_version=$(adb version 2>/dev/null | head -n 1)
    append "ADB version: ${adb_version:-Unknown}"
else
    append "ADB installed: No"
fi

section "KERNEL"
append "$(uname -r)"

# Print to terminal
echo -e "$out"

# Print copy-ready block
echo -e "\n=== COPY BELOW ==="
echo "------------------"
echo -e "$out"
echo "------------------"
```

Copy the output from the `=== COPY BELOW ===` block and include it with your support request.
