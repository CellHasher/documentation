---
description: >-
  Cellhasher offers a no-code automated flow builder. Learn here how to run
  commands, taps, swipes, installations, and more across single or multiple
  phones at once.
---

# Automation

***

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 174329.png" alt=""><figcaption><p>View of the Automation tab</p></figcaption></figure>

***

### Overview: A Visual Node-Based Automation

The **Node Palette** on the left panel contains drag-and-drop nodes you can use to build flows:

* **Flow Nodes** — Start and End blocks (entry and exit points).
* **UI Actions** — Simulate user input: Tap, Swipe, Type Text, or Press Keys.
* **ADB Actions** — Run custom shell commands, install APKs, or copy text to clipboard.

Each node is configurable and can include delays, arguments, or custom variables.\
Nodes are connected together to form logical automation chains that execute step-by-step on selected devices.

| Feature                    | Description                                 |
| -------------------------- | ------------------------------------------- |
| **Visual No-Code Builder** | Drag-and-drop node automation               |
| **Multi-Device Execution** | Run flows on multiple phones simultaneously |
| **GitHub APK Integration** | Auto-install from live repositories         |
| **Mirror**                 | Build flows while viewing device feedback   |
| **Import a Flow**          | Supports JSON, TXT, and CSV                 |
| **Device-Specific Taps**   | Adjust for different resolutions or layouts |

### Click-to-Create Automation (Live Mirroring Integration)

When a device is mirrored on the right-hand side, you can:

* **Hold `Ctrl` + Click** anywhere on the mirrored screen.\
  → A **Tap Node** is instantly added to your flow with exact coordinates captured.

This makes it easy to **build flows live** while seeing what’s happening on the actual device in real-time — ensuring perfect alignment of taps and actions.

***

### Nodes Types

<table><thead><tr><th width="221">Node Type</th><th>Purpose</th></tr></thead><tbody><tr><td><strong>Start / End</strong></td><td>Defines beginning and end of the flow</td></tr><tr><td><strong>Tap</strong></td><td>Tap on-screen coordinates</td></tr><tr><td><strong>Swipe</strong></td><td>Swipe between two points</td></tr><tr><td><strong>Input Text</strong></td><td>Type text input (e.g. apply credentials)</td></tr><tr><td><strong>Key Press</strong></td><td>Simulate button (e.g. HOME or BACK)</td></tr><tr><td><strong>ADB Command</strong></td><td>Run any ADB shell command</td></tr><tr><td><strong>Install APK</strong></td><td>Install APK from file, URL, or GitHub</td></tr><tr><td><strong>Set Clipboard</strong></td><td>Copy text into device clipboard (e.g. paste QR data)</td></tr><tr><td><strong>Wait / Delay</strong></td><td>Add time between actions (e.g. add 10s of waiting margin)</td></tr></tbody></table>

***

### Example: Setting up Acurast Processor (Lite)

One of the most common uses of this page is for Acurast provisioning, using the built-in Install-Provision-AcurastLite Flow.

This flow:

1. Installs the Acurast Processor Lite APK directly from GitHub
2. Sets the device clipboard with the Acurast Work Profile QR code
3. Launches the Acurast app using an ADB Shell Command
4. Taps on-screen buttons in the correct sequence to complete setup

This pre-made automation is designed for HMD Vibes, the same model included in _Cellhasher Classic + 20 Phones_ . Because other Android screens may vary slightly in resolution or layout, users may need to tweak tap coordinates for other phone models.

<a href="../../.gitbook/assets/Install-Provision-AcurastLite(HMD-Vibe).json">Download: Install-Provision-AcurastLite(HMD-Vibe).json</a>

<div><figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 173242.png" alt=""><figcaption></figcaption></figure> <figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 173334.png" alt=""><figcaption></figcaption></figure> <figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 173354.png" alt=""><figcaption></figcaption></figure></div>

***

### Flow Loading & Format Support

You can load and run automation flows in several formats:

| **Format** | **Description**                                                     |
| ---------- | ------------------------------------------------------------------- |
| **.JSON**  | Full automation flow with metadata, node structure, and connections |
| **.TXT**   | List of ADB commands (one per line)                                 |
| **.CSV**   | Command lists with arguments, durations, and delays                 |

***

### Tips for Creating Your Own Flows

* Use **Ctrl+Click** on live mirrors to build accurate Tap positions
* Add short **Wait nodes** between steps (2–3s) to prevent timing issues
* Save reusable flows to your **Library** for quick access
* Adjust Tap coordinates if using devices with different resolutions
* Combine with **Terminal scripts** for advanced hybrid automation



Each node has configurable **pre-wait** and **post-wait** timings to ensure stable execution across slower devices or network delays.
