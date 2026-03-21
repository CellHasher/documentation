# Proxy and WebRTC Settings

### Recommended: 🔒 Proxy and WebRTC Settings

To ensure privacy and stable performance during automation tasks:

* Configure a **reliable proxy** connection before running operations.
* Verify your **WebRTC** settings are properly adjusted to prevent IP leaks.

These configurations help protect your identity and maintain high performance.



### 📱 Connecting Your Android Device

To connect your Android phone to your computer with **Developer Mode** enabled:

1. Plug the phone into your computer using a USB cable.
2. Enable **USB Debugging** on the phone.

> ⚠️ **Note for Xiaomi, Redmi, and similar devices:**\
> After enabling Developer Mode, go to **Developer Options → USB Debugging** and ensure these options are enabled:
>
> * **USB Debugging**
> * **Install via USB**
> * **USB Debugging (Security Settings)**



Before connecting your Android device to **CellHasher**, you’ll need to enable **Developer Mode** and **USB Debugging**.\
Follow the steps below to prepare your phone.





### 🌐 Download and Installation

Visit the official Cellhasher GitHub to download the latest version.

[Cellhasher GitHub](https://github.com/CellHasher/Beta-Cellhasher/releases)

> **ℹ️ Note:** Software updates are not automatic currently. Check Discord and GitHub occasionally for the latest release.



> ⚠️ **Note:** When multiple Cellhasher connections to one PC, your PC may fail to manage all the USB devices. are powered and recognized by Windows before proceeding.



<details>

<summary><strong>Method 1</strong>: Use Cellhasher Provided BMS Cables</summary>

Cellhasher units come with BMS cables that attach to certain phones without additional DIY. The provided cables work with Samsung S10, S9, S8, S7, S6, Note9, Note8, and Note5 series.

</details>

<details>

<summary><strong>Method 2: Custom Soldering Full Circuit</strong></summary>

Use the entire battery circuit when creating the cable, soldering the positive and negative wires correctly. Wrap with electrical tape or heat shrink.

</details>

<details>

<summary><strong>Method 3: Custom Soldering Without Circuit</strong></summary>

Cut the BMS cable, expose the trace, and carefully solder the wires directly. Wrap the cable securely to avoid shorts.

</details>

***

***

## Step 1: Gather Equipment

1. **Acquire Android Smartphone(s)**
2. **Optional: Gather Tools or Purchase With Cellhasher**
   1. Disassembly kit for phones
   2. Soldering iron & solder wire
   3. Multimeter

<div><figure><img src="../.gitbook/assets/Addon3.png" alt=""><figcaption></figcaption></figure> <figure><img src="../.gitbook/assets/Addon1.png" alt=""><figcaption></figcaption></figure> <figure><img src="../.gitbook/assets/Addon2.png" alt=""><figcaption></figcaption></figure></div>

## Step 2: Prepare the Phones

1. **Enable developer options in Settings**

* Locate the "Build number" in your phone's settings. Tap the build number 7-times to enable developer options.

2. **Configure these recommended settings**

* Turn-on the following:
  * "Stay awake"
  * "OEM Unlock" (if available)
  * "USB Debugging"
  * "Wireless debugging"
  * "Disable ADB authorization timeout"
* Turn-off the following:
  * "Automatic updates"



## Step 3: Disassemble the Phones

> **🚨 Danger:** Lithium-ion batteries can explode if punctured. Be very careful and perform your due diligence before proceeding.

1. **Remove the battery and other optional components**

* Using a disassembly kit, remove the outer casing on the phone to expose the internal components. Remove any additional guards or coverings securing the battery. Carefully proceed by researching how to remove your specific phone model's battery. For instance, applying 90% isopropyl separates any adhesives well. Set the battery aside. In most cases, this is sufficient but you may continue to detach other components such as the camera, screen, or haptic engine as you wish.

2. **Record your phone's votlage requirements**

* Review the label on the battery and record it's Nominal Voltage and Charge Voltage.

3. **Dispose or store the battery properly**

<div align="left"><figure><img src="../.gitbook/assets/phones disassembled side by side.jpg" alt="" width="375"><figcaption></figcaption></figure></div>



## Step 4: Adjust Your Cellhasher's Voltage

> **ℹ️ Note:** Cellhasher outputs the same voltage to all 20 phone ports.

1. **Set the input voltage**

* Locate the sticker on the power supply labeled 110V/220V. Use a stiff, slim tool to reach into the space, sliding and locking the red switch to the voltage your power circuit uses (U.S. residential is typically 110-120V).

2. **Set the output voltage**
   1. **Determine your required potentiometer**
      * Each Cellhasher comes with a **white** potentiometer installed in the power supply. Provided with each Cellhasher purchase comes an optional **blue** potentiometer. Your phone's Charge Voltage, will determine which potentiometer you need:
        * The **white** potentiometer can be adjusted to output 4.48–5.10V.
        * The **blue** potentiometer can be adjusted to output 4.30–5.25V.
      * If your phone model's Charge Voltage falls within the range of the **white** potentiometer, proceed to c. and adjust the potentiometer.
   2.  **Optional: replace the white for the blue potentiometer**

       * Remove the power supply from the Cellhasher unit.&#x20;
       * Only onescrew is holding the lid on the PSU. There are two additional screws required for removing the PSU board from it's shell completely.

       <div align="left"><figure><img src="../.gitbook/assets/PSU screw lid.avif" alt="" width="563"><figcaption><p>Screw holding lid</p></figcaption></figure></div>
   3. **Read voltage and adjust potentiometer**
      * Double check your input voltage, then power on your Cellhasher. Continue by using one of the two methods to read the output voltage in order to be able to adjust it accordingly. If you have a Wi-Fi + Ethernet Cellhasher, you will use the mulitmerter method.
        * **Multimeter**: Place your positive and negative pins in on the outputting side of the power supply. This location will read **0.25V** than what the phone will receive. For example, if you read 5.07V here, your phone will receive 4.82V.
        * **Digital meter**: Plug in to any USB port and record. The BMS port receives **0.18V** less than the USB port. For example, if you read 5.0V here, your phone will receive 4.82V.
      * Use stiff, slim screwdriver or other tool to gently spin the potentiometer. It's recommended to start with ½ turns, carefully not over spinning the dial. Use this process to set voltage your phone will recieve to the Charge Voltage. Power off the Cellhasher.

## Step 5: Connect Battery Management System Cables (BMS Cables)

* **Use one of the following methods for your BMS cables:**

### Method 1:

**Using Cellhasher Provided BMS Cables**

Cellhasher units come with BMS cables that attach to certain phones without additional DIY. The provided cables work with Samsung S10, S9, S8, S7, S6, Note9, Note8, and Note5 series.

### Method 2:

**Custom Soldering Full Circuit**

Use the entire battery circuit when creating the cable, soldering the positive and negative wires correctly. Wrap with electrical tape or heat shrink.

<div><figure><img src="../.gitbook/assets/bms 3.avif" alt=""><figcaption><p>Method 2</p></figcaption></figure> <figure><img src="../.gitbook/assets/bms 2.png" alt=""><figcaption><p>Method 2</p></figcaption></figure></div>

<div><figure><img src="../.gitbook/assets/battery 1.png" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure> <figure><img src="../.gitbook/assets/battery 2.avif" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure> <figure><img src="../.gitbook/assets/battery3.png" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure></div>

### Method 3:

**Custom Soldering Without Circuit**

Cut the BMS cable, expose the trace, and carefully solder the wires directly. Wrap the cable securely to avoid shorts.

<figure><img src="../.gitbook/assets/bms 1.png" alt=""><figcaption><p>Method 3</p></figcaption></figure>

<div><figure><img src="../.gitbook/assets/battery 1.png" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure> <figure><img src="../.gitbook/assets/battery 2.avif" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure> <figure><img src="../.gitbook/assets/battery3.png" alt=""><figcaption><p>Removing ribbon for method 2 &#x26; 3</p></figcaption></figure></div>

* **Test and Troubleshoot**
  * Ensure the device powers on after connecting the BMS cable. If issues arise, check solder connections, voltage settings, and wire orientation.

## Step 6: Tape and Replace Back Plate&#x20;

* Use a snipping tool to cut majority of the backplate off. Leave enough to secure the battery connection point using a few screws.&#x20;
* Gently fold, flatten, and tape the BMS cable to secure it.

<div align="left"><figure><img src="../.gitbook/assets/IMG_7928.JPEG" alt="" width="375"><figcaption></figcaption></figure></div>

## Step 7: Insert Phones into Chassis

* Using the USB stubs provided, connect the phones and their BMS cable into each slot on the motherboard.
* Once complete, power on.

<div align="left"><figure><img src="../.gitbook/assets/Cellhasher install.jpeg" alt="" width="375"><figcaption></figcaption></figure></div>

> ## ✅ Done!
>
> Share your set up with the links below and head to [set-up-download.md](../cellhasher-control/set-up-download.md) to start controlling your phones!&#x20;
>
> <a href="https://x.com/CellHasher" class="button secondary">Follow Cellhasher on X</a> <a href="https://discord.com/invite/9bGE6e4X2c" class="button secondary">Join us on Discord</a>
