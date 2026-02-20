---
description: >-
  The Miner tab is build for simple execution to mine using your devices. You
  can install, configure, and launch various miners on multiple devices at once,
  using a clean UI.
---

# Miner

***

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 174732.png" alt=""><figcaption><p>View of the Miner tab</p></figcaption></figure>

***

## Overview of the Miner Dashboard

The Miner Dashbaord is made of 3 tabs:

[#assignments](miner.md#assignments "mention") → Manage bulk device assignments and run miners

[#flightsheets](miner.md#flightsheets "mention") → Configure pools, wallet addresses, and algorithms

[#miner-types](miner.md#miner-types "mention") → Create or edit miner logic (install, run, stop scripts)

***

## Assignments

The **Assignments tab** shows connected devices ready to be assigned to bulk mining sheets. Each device displays its model, IP, and connection type.

Note: Greyed out bulksheets as shown in the image above simply mean the device is not connected to the manager software.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 175538.png" alt=""><figcaption></figcaption></figure>

***

## Flightsheets

A **Flightsheet** defines how your miner runs — including algorithm, pool URL, wallet address, and thread count.

<div><figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 175635.png" alt=""><figcaption></figcaption></figure> <figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 174938.png" alt=""><figcaption></figcaption></figure></div>

> Example of creating a **Solo BTC Flightsheet**, defining miner type, pool, wallet, and other configuration details.

#### Creating a Bulksheet

Each **Bulksheet** is a collection of devices running the same Flightsheet.\
You can create multiple bulksheets for different coins or miner types.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 182451.png" alt=""><figcaption></figcaption></figure>

> All available devices are listed at the top. You can drag and drop devices into a new Bulksheet or hold Ctrl/Cmd to duplicate them across multiple sheets.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 175538.png" alt=""><figcaption></figcaption></figure>

> Example of configured bulksheets for BTC, Verus, Virel, and more — each containing 20 devices.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 182606.png" alt=""><figcaption></figcaption></figure>

> Use the 3-dot menu to install miners, install Termux, uninstall, or duplicate bulksheets. You can install miners on all 20 devices simultaneously.

***

## Miner Types

The **Miner Types** tab lets you edit or create miner logic —\
Each miner has **Install**, **Run**, **Stop**, and **Uninstall** scripts, typically written in Python.\
(Must setup Miner Types first for any of the flightsheet,running,bulksheets to work)

{% hint style="success" %}
Our Pre-Made Miner Types Require you to have python path setup in the Settings Page
{% endhint %}

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 175652.png" alt=""><figcaption><p>Use <strong>CH Miners</strong> to quickly import ready-to-use miner templates from CellHasher’s GitHub.</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 183419.png" alt=""><figcaption><p>Example: Editing a Bitcoin miner type. You can customize commands, add dependencies, and manage install logic. Note, you do not need lines 4-8 in the install script, but do want them in the (Run Script) if you make your own script, this communicates with our environment flight sheets.</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 183339.png" alt=""><figcaption><p>Creating a new Miner Type from scratch — includes a Python script template ready for custom miner logic.</p></figcaption></figure>

***

### Step-by-Step: Begin Mining

1. **Install First** → Ensure the latest version of CellHasher is installed.
2. **Set Up Flightsheet** → Add your wallet, pool, and miner type under _Flightsheets_.
3. **Assign Devices** → Go to _Assignments_, drag devices into your preferred Bulksheet.
4. **Install Miner** → Click the 3-dot menu → _Install Miner (All)_.
5. **Run the Bulksheet** → Once installed, hit _Run_ to start mining.
6. **Monitor Progress** → Use _Detached Mirror Window_ to view screens, or use **v0.3** for low-end mirror-only control.
7. **(Optional)** Multi-task → With _wake-locks_ enabled, miners can run while you use apps like **Grass** or **Acurast**.
8. If a Miner doesn't install its more than likely okay, just need to clear it on the device the uninstall script, select the devices you want to run it on in the Bulksheet, open the 3 dots menu and uninstall the miner/install the miner, use the repair tool as well if needed.

***

### Setting Up Your Miner Scripts

Each miner has **Install**, **Run**, **Stop**, and **Uninstall** scripts that define how it behaves on your devices.\
When writing these scripts, always include the system environment variables so your miner automatically receives configuration data from your Flightsheets.

**Base variables:**

```python
ADB = os.environ.get("adb_path", "adb")
devices = os.environ.get("devices", "").split()
wallet_address = os.environ.get("wallet_address", "")
pool_url = os.environ.get("pool_url", "")
threads = os.environ.get("threads", "8")
algorithm = os.environ.get("algorithm", "")
password = os.environ.get("password", "")
additional_flags = os.environ.get("additional_flags", "")
```

**For XMRig miners, also add:**

```python
cpu_max_threads_hint = os.environ.get("cpu_max_threads_hint", "")
xmrig_algorithm = os.environ.get("xmrig_algorithm", "")
custom_flags = os.environ.get("custom_flags", "")
```

These are automatically injected from your **Flightsheets** whenever you install or run miners, allowing fully dynamic setups without modifying your code.\
The install script usually prepares Termux and downloads dependencies, while the run script executes your miner with the provided pool, wallet, and thread count.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 183947.png" alt=""><figcaption></figcaption></figure>

> Example: ADVC miner type showing environment-driven install logic in Python.

### Advanced Features

* Create **custom miner types** with Python logic
* Import **CH Miners** from GitHub
* Edit, duplicate, or delete existing flightsheets
* Install or repair Termux automatically
* Use the **Repair Termux (pkg cache)** tool from the Scripts page if any installation fails

***

### Troubleshooting

The Troubleshoot Tab includes a “Try Our Repair Tool” button for automated fixes. Sometimes, when installing miners on multiple devices, one or two may fail due to mirror errors or slow internet. (Troubleshoot Button is located at the top of the Miner page.) Use the **Automated Repair Tool** instead of reinstalling manually.

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 183633.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/Screenshot 2025-10-24 181013.png" alt=""><figcaption></figcaption></figure>
