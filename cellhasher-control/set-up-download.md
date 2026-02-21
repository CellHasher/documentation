---
description: >-
  Follow the steps below to download Cellhasher Control. Please be aware
  Cellhasher Control is currently in beta, with frequent new versions and
  improvements.
---

# Set-Up (Download)

***

{% hint style="info" %}
#### Minimum System Requirements

**Computer**

* Operating System: macOS, Windows 10 (64-bit), Linux
* GPU: For screen mirroring 20 or more phones, a moderate performance graphics card is recommended. Some integrated graphics (APUs) have proven sufficient for light workloads.

**Phone**

* Operating System: Android 9 or higher
{% endhint %}

## Installing Cellhasher Control

{% hint style="info" %}
You may receive a warning prompt when opening the application. This is due to Cellhasher Control being in beta release and will be resolved at full release.
{% endhint %}

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

1. Download the installer for your operating system below:

<!-- Dynamic download buttons loaded from releases.json -->
<div id="ch-download-section" style="margin:16px 0 8px;">
  <p style="color:#888;font-size:14px;">Loading downloads…</p>
</div>

<script>
(async function () {
  var section = document.getElementById('ch-download-section');
  if (!section) return;

  var RELEASES_URL = 'https://raw.githubusercontent.com/CellHasher/documentation/main/releases.json';

  var PLATFORM_LABELS = {
    mac:     { arm64: 'macOS – Apple Silicon', intel: 'macOS – Intel' },
    windows: { x64:   'Windows (x64)' },
    linux:   { deb:   'Linux (.deb)' }
  };

  function trackDownload(platform, arch, version) {
    if (typeof gtag === 'function') {
      gtag('event', 'download', {
        event_category: 'Software',
        event_label: platform + ' ' + arch + ' v' + version,
        app_version: version,
        platform: platform,
        architecture: arch
      });
    }
  }

  try {
    var res  = await fetch(RELEASES_URL);
    var data = await res.json();
    var version   = data.version;
    var downloads = data.downloads;

    var html = '<p style="margin-bottom:12px;font-weight:600;">Version ' + version + '</p>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;">';

    for (var platform in downloads) {
      var archs = downloads[platform];
      for (var arch in archs) {
        var url   = archs[arch];
        var label = (PLATFORM_LABELS[platform] && PLATFORM_LABELS[platform][arch])
                    ? PLATFORM_LABELS[platform][arch]
                    : platform + ' ' + arch;

        html += '<a href="' + url + '"'
              + ' onclick="(function(p,a,v){if(typeof gtag===\'function\'){gtag(\'event\',\'download\',{event_category:\'Software\',event_label:p+\' \'+a+\' v\'+v,app_version:v,platform:p,architecture:a})}})(\''+platform+'\',\''+arch+'\',\''+version+'\')"'
              + ' style="display:inline-flex;align-items:center;padding:10px 20px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;border:1px solid #333;"'
              + '>' + label + '</a>';
      }
    }

    html += '</div>';
    section.innerHTML = html;
  } catch (e) {
    section.innerHTML = '<p>Could not load downloads automatically. Use the link below to download from GitHub.</p>';
  }
})();
</script>

<a href="https://github.com/CellHasher/Beta-Cellhasher/releases" style="font-size:14px;">View all releases on GitHub →</a>

2. Run the installer and follow the on-screen instructions.
3. Cellhasher Control is in beta — check the GitHub releases page regularly for new builds.

## Next Steps

#### 1. Configure Settings

Head to [settings.md](tabs-walkthrough/settings.md "mention") to set paths to use certain features and import ADB Authorization Key files.

#### 2. Allow USB Debugging on your devices

Allow USB Debugging on your devices if you haven't already. Go to [enabling-usb-and-wireless-debugging.md](../additional-docs/enabling-usb-and-wireless-debugging.md "mention") so that your phones can connect to your computer.
