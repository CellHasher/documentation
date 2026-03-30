---
description: >-
  To control your phones without using with their touch screen, you will need to
  enable USB Debugging, located in your devices developer settings. This guide
  instructs how to set it up.
---

# Enabling USB (and Wireless) Debugging

***

> ✅ Cellhasher purchases with phones pre-installed include ADB Authoization Keys, removing the need for this process. Proceed to [settings.md](../cellhasher-control/tabs-walkthrough/settings.md) to import Cellhasher-provided ADB keys, or your own.

### 1. Enable Developer Options

For a visual walkthrough, here are guides for popular devices:

* [Samsung](https://youtu.be/AwYqeVqnyZw?si=gH9pD5pXQmLTQ58l)
* [Motorola](https://www.youtube.com/watch?v=tJfANw2ppJA)
* [Xiaomi](https://youtu.be/LFZo5ziby3k?si=d-zGYJ57Ua5WmYjy)
* [Oppo](https://youtu.be/SUxJo06247E?si=RPJ2E1aUlON8Pi-P)
* [Google Pixel](https://youtu.be/d2OTrHpuq7o?si=EiGb0_WMQYNGMTXH)
* [Huawei](https://youtu.be/udC_RCaI0pU?si=BXIt98UxlMs1ayhK)
* [Sony](https://youtu.be/sj_KxMnj6tw?si=EsrCTHj8f2fAD0DW)
* [Redmi](https://youtu.be/M7mEqXHxzv0?si=sPruepKFb_25if7_)

**To enable manually:**

1. Open your device's Settings application.
2. Locate and tap About Phone, typically near the bottom and tap About Phone or About Device).
3. Locate Build Number, typically scroll down near the bottom. Tap the Build Number seven times in a row quickly until you see _“You are now a developer”_.
4. Return to the Settings homepage and near the bottom locate Developer Options. It may be located within System. Open Developer Options and proceed below.

> **ℹ️ Note:** The exact steps may vary slightly depending on your Android version or phone brand. If you can’t find “Build Number,” search for it in the Settings search bar.

***

### 2. Turning on USB Debugging and Optional Settings

In Developer Options, locate each of the settings below and toggle accordingly.

**Required:**

1. Turn on USB Debugging
2. Turn on Disable adb authorizaition timeout

**Recommended:**

3. Turn on stay awake
4. Turn on OEM unlock
5. Turn off automatic updates

**Circumstantial:**

7. Turn on Wireless Debugging to allow for control of your device over your network. You will need this setting on if you plan to use Ethernet with your Cellhasher.
8. Turn off Verify Apps over USB if you need a specific app to install that is not installing or are having trouble connecting to a network using [network.md](../cellhasher-control/tabs-walkthrough/network.md) tab, otherwise leave off on for safety

***

### 3. Authorize Connection

> **ℹ️ Note:** If you intend to use a Windows/Linux PC with Cellhasher Control, you may need to have Cellhasher Control open during this step to trigger the authorization prompt. Therefore, it's recommended to complete [set-up-download.md](../cellhasher-control/set-up-download.md) and set the correct paths in [settings.md](../cellhasher-control/tabs-walkthrough/settings.md) if you do not encounter a prompt.

1. Connect your device to your PC using either with a cable or by plugging it into the Cellhasher (with the Cellhasher connected to the computer).
2. When prompted, select "Always allow USB Debugging for your computer" then click "OK".
3. Proceed to use Cellhasher Control to now see and control your phones!

<div align="left"><figure><img src="/broken/files/9GciXK0d1uBstWhTtovX" alt=""><figcaption></figcaption></figure></div>
