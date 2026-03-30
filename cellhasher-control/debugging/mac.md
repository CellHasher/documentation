# macOS

Use the script below to collect system info needed for debugging Cellhasher Control on macOS.

## System Info Script

Run the following script in Terminal and paste the output when reporting an issue:

```bash
#!/usr/bin/env bash

out=""

section() { out+="\n=== $1 ===\n"; }
append()  { out+="$1\n"; }

section "OS INFO"
append "OS Name: $(sw_vers -productName)"
append "OS Version: $(sw_vers -productVersion)"
append "Build: $(sw_vers -buildVersion)"

section "ARCHITECTURE"
kernel_arch=$(uname -m)
append "Kernel architecture: $kernel_arch"
if [[ "$kernel_arch" == "arm64" ]]; then
    append "Chip: Apple Silicon"
else
    append "Chip: Intel"
fi
rosetta=$(sysctl -n sysctl.proc_translated 2>/dev/null)
if [[ "$rosetta" == "1" ]]; then
    append "Running under Rosetta 2: Yes"
else
    append "Running under Rosetta 2: No"
fi

section "ADB CHECK"
if command -v adb >/dev/null 2>&1; then
    append "ADB installed: Yes"
    append "ADB path: $(command -v adb)"
    append "ADB version: $(adb version 2>/dev/null | head -n 1)"
else
    append "ADB installed: No"
fi

section "KERNEL"
append "$(uname -r)"

echo -e "$out"

echo -e "\n=== COPY BELOW ==="
echo "------------------"
echo -e "$out"
echo "------------------"
```

Copy the output from the `=== COPY BELOW ===` block and include it with your support request.
