---
hidden: true
---

# Installing

> **ℹ️ Note:** Cellhasher Control is currently in Beta.

---

## 1. Download Cellhasher Control

### Automatic Download

<div id="ch-download-container">
  <!-- Auto-detected primary download — shown by os-detect.js when a match is found -->
  <div id="ch-auto-download" hidden>
    <button id="ch-download-primary" type="button" class="ch-download-btn" aria-label="Download for detected OS">
      <span id="ch-download-primary-text">Detecting your OS&hellip;</span>
    </button>
  </div>

  <!-- Manual / fallback section — always visible; individual items hidden if no asset exists -->
  <div id="ch-fallback-download" hidden>
    <h4>Choose your platform:</h4>
    <ul id="ch-platform-list"></ul>
    <p>
      Or
      <a
        href="https://github.com/CellHasher/Beta-Cellhasher/releases"
        target="_blank"
        rel="noopener noreferrer"
        >browse all releases on GitHub</a
      >.
    </p>
  </div>
</div>

### OS-Specific Notes

| Platform | File type | Notes |
|---|---|---|
| **Windows** | `.exe` installer | Run the installer and follow the prompts. |
| **macOS — Apple Silicon** | `.dmg` | Open the `.dmg`, drag to Applications. You may need to run `xattr -cr /Applications/cellhasher_controller.app` if macOS flags the app. |
| **macOS — Intel** | `.dmg` | Open the `.dmg`, drag to Applications. Same quarantine note as above. |
| **Linux — deb** | `.deb` | `sudo dpkg -i cellhasher_controller_*.deb` |
| **Linux — appimage** | `.AppImage` | `chmod +x cellhasher_controller_*.AppImage` AppImages require FUSE to run. `sudo apt install libfuse2` *x11* driver is recommended. `echo $XDG_SESSION_TYPE` |

> **Privacy notice:** Download button clicks are tracked only if you have enabled analytics
> in the consent prompt. You can change your preference at any time by clearing the
> `cellhasher_analytics` key from your browser's `localStorage`.

---

* [debugging](./debugging)


## 2. Download Additional Requirements

1. Open Cellhasher Control and navigate to the [Network](tabs-walkthrough/network.md) tab.
2. Use the quick-download buttons to install the additional requirements needed for certain features (e.g. scrcpy).

---

## 3. Set Up ADB Keys (USB Debugging)

Connect your Cellhasher to a computer via the included data cable and open Cellhasher Control.

* **A)** If you ordered pre-installed, import your existing ADB key file.
* **B)** If you already have ADB keys, copy `adbkey` and `adbkey.pub` from your existing
  `.android` folder to `C:\Users\[Your Username]\.android` (Windows) or
  `~/.android/` (macOS / Linux).
* **C)** If this is a new setup, open each device in Cellhasher Control and select
  **"Always allow from this computer"** when prompted — you only need to do this once
  per computer.

---

## 4. Learn How to Use

Once installed and connected, refer to the [How to Use](how-to-use/index.md) section to
get started with your Cellhasher.
