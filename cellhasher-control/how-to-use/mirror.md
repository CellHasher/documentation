# Mirror

## Toolbar Functions:

<div align="left"><figure><img src="/broken/files/bip6Fb1G2U5YsubME7mK" alt=""><figcaption></figcaption></figure> <figure><img src="/broken/files/xwO3XC6NGF9hmBadXMxC" alt=""><figcaption></figcaption></figure></div>

* Back Arrow: Return to Devices Screen
* Eye Icon: Quick view all devices
* Optimizer: Run a performance optimization on selected devices
* Mining Toggle: Start/Stop mining on selected devices (change mining function in settings) - [See more below](mirror.md#step-7-enable-auto-boot-on-android-optional)
* Mirror: Start screen mirroring on selected devices (When troubleshooting, inspect [No Audio](../tabs-walkthrough/network.md#no-audio) settings)
* Refresh: Update device list and connection status
* Screen Sleep: Turn off displays while keeping devices awake on selected devices
* Settings: Access configuration screen

***

## Device List:

<div align="left"><figure><img src="/broken/files/BBAInQI1hWnD8UYhfMeH" alt=""><figcaption></figcaption></figure></div>

* Tag: Customize device names
* Mirror: Immediately start individual device mirroring
* Select: Add device to selection group

***

## Action Dropdowns:

<div align="left"><figure><img src="/broken/files/tuHXNRYVa2eKt9JbhyMu" alt=""><figcaption></figcaption></figure></div>

* Battery Temperature Control
  * Submit custom temperature
  * Reset: Set to real temperature
    * Leave as-is unless the device issues a battery temp warning. Otherwise set to 20°C.
* Battery Level Management
  * Submit: custom battery level
  * Reset: Set to real battery level
    * Use this feature to set the battery to 1-100% to avoid the phone interpreting the lack of battery as 0%, therefore shutting itself off repeatedly. &#x20;
* Wi-Fi Configuration
  * Set SSID (network name) and password
* Package/APK Management
  * Install APK files using Browse and Install
  * Custom Hard Remove feature for debloating - [See more below](mirror.md#debloating-devices)
    * By default, Cellhasher provides a custom list of popular packages for Hard Remove. Edit what is included in Hard Remove in Settings. See below:
* Script Execution
  * Select Script
    * Execute your own script using Browse and Run Script&#x20;
  * Pre-Made Script
    * Select a pre-made script provided by Cellhasher
    * The pre-made scripts can be ran again on the same device if you experience an execution failure.

***

## Grid Display Area:

<figure><img src="/broken/files/Cy2O2en9pHfvLaijbNTG" alt=""><figcaption></figcaption></figure>

* The mirror feature will intiate the selected phones to appear in the grid display. The devices will appear one-at-a-time, and continue to rearrange automatically until all selected devices appear.
* Use the window header's expand feature to show a single device full-screened.

{% hint style="info" %}
Known issue: If a device does not appear on the initial mirroring and leaves a gap, select that device's individual mirror button on the side panel.
{% endhint %}
