---
description: >-
  Understand the difference in using USB (Wi-Fi) and OTG (Ethernet) modes.  This
  guide explains how each mode works, how to switch between them, and how to
  troubleshoot common connection issues.
---

# Connection Modes: Wi-Fi and Ethernet

***

### **`Wi-Fi`** vs. **`Wi-Fi+Ethernet`**&#x20;

When purchasing you may be required to make a selection of either **`Wi-Fi`** or **`Wi-Fi+Ethernet`**. The is reflected by the different Cellhasher control board used for each model.

The **`Wi-Fi`** variant supports only USB mode of the control board. The **`Wi-Fi+Ethernet`** variant supports both USB and OTG modes of the control board. Only one mode is able to be active at a time.

{% hint style="info" %}
&#x20;**`Wi-Fi`** and **`Wi-Fi+Ethernet`**  could accurately be referred to as  **`USB`** and **`USB+OTG`**  but we chose to keep it simple to highlight their primary difference.
{% endhint %}

| Variant                | Supported Modes | Toggling                                                       | How to Control Phones                                                                                                                          |
| ---------------------- | --------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
|  **`Wi-Fi`**           | **USB**         | Always in USB mode                                             | Phones communicate with your PC over the provided USB to Type-B cable.                                                                         |
|  **`Wi-Fi+Ethernet`**  | **USB and OTG** | Toggle modes with the **⏻** button by quickly double clicking. | <p><strong>USB:</strong> Same as above<br><br><strong>OTG:</strong> Phones communicate with your PC over network (LAN) via Ethernet cable.</p> |

{% hint style="info" %}
**Important:** Ethernet on a phone is made possible by enabling the Developer Option called Wireless Debugging. Wireless Debugging—and thus Ethernet—must be re-enabled after each time a phone power-cycles. To re-enable this quickly, connect your phones via USB mode and click connect to LAN on the [devices.md](../cellhasher-control/tabs-walkthrough/devices.md "mention") page. Follow the video guide below for this process.
{% endhint %}

***

### 🎥 Video Guide

Watch the full tutorial on how to switch between USB (Wi-Fi) and OTG (Ethernet) modes below:

{% embed url="https://www.youtube.com/watch?v=0B3hKAl8g80" %}

***

### USB Mode

USB mode is always the default connection state when turning on your Cellhasher, even after turning off when in OTG mode. In Cellhasher Control, each device cards will display a blue phone icon next to the device serial ID to indicate it's in USB mode.

#### Using USB Mode

1. With devices installed, connect a Type-B to USB cable to your PC.&#x20;
2. Open Cellhasher Control and go to [devices.md](../cellhasher-control/how-to-use/devices.md "mention") Tab.&#x20;
3. Verify if each device card shows a blue phone icon next to its serial ID — this indicates an active USB connection. If not, proceed by&#x20;

{% hint style="info" %}
If connecting multiple Cellhashers to one PC, the PC may fail to recognize and manage all the USB devices. Make sure you have an adequate system if you'd like to manage multiple Cellhashers at once.
{% endhint %}

***

### OTG Mode

OTG mode allows any phones that contain the internal drivers for Ethernet to utilize an Ethernet connection to your network. However, an initial USB connection is required to enable and assign TCP/IP communication.

#### Using Ethernet for the First Time

{% hint style="info" %}
Make sure you have enabled Wireless Debugging enabled prior to continuing. Refer to [enabling-usb-and-wireless-debugging.md](enabling-usb-and-wireless-debugging.md "mention") if not turned on already.
{% endhint %}

1. Start by your Cellhasher powered on and in USB mode.
2. In the [devices.md](../cellhasher-control/how-to-use/devices.md "mention") Tab, select all of your desires phones.
3. Click the **LAN Connect** button at the top of the Device Tab. This opens the Connect to LAN popup.
4. After clicking **Continue**, the setup window will appear with network configuration details.
5. Enter your PC’s local IP address (e.g. `192.168.1.100`). The PC must be on the same network that your Cellhasher is connected via Ethernet to.
6. Leave the default port set to `5555` (recommended).
7. Click **Switch to LAN**.
8. Confirm if your configuration looks correct—you’ll receive a confirmation window before the switch begins.
9. On your Cellhasher, double-click the **⏻** button to toggle from USB to OTG mode.
10. The Cellhasher LED indicators will change from blue (USB) to green (OTG) to indicate successful connection to the network.
11. &#x20;Click **Scan Ports**.
12. The system will scan for devices on port 5555 and connect to them over the LAN.

{% hint style="success" %}
&#x20;Done! Devices discovered on the network will appear — now connected via LAN.
{% endhint %}

***

### Troubleshooting & Developer Notes

> **Developer Insight:**\
> When you click Convert to WiFi, it automatically enables TCP port 5555 on all devices.\
> After converting to Ethernet mode, you may wish to disable Wi-Fi on each device to ensure stable OTG routing.

> **ADB Connection Lock:**\
> If a port scan stalls, one of your devices may be waiting for an ADB authorization prompt.
>
> * Check the phones’ screens and accept the USB debugging prompt.
> * Alternatively, go to Settings → Restart ADB Server in the app to reset connections.

> **If no devices appear after scanning:**
>
> * Confirm that your host PC and Cellhasher chassis are on the same network/subnet.
> * Check that port 5555 is open and reachable.
> * Verify that the chassis successfully switched to Ethernet mode (green lights).
