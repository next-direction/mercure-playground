const url = new URL('your-hub-url-here');
url.searchParams.append('topic', 'my-own-topic');

const header = {
    "alg": "HS256",
    "typ": "JWT"
};

const data = {
    "mercure": {
        "subscribe": ['test']
    }
};

// JWT_SECRET from mercure hub
const secret = "your-secret-here";

function base64url(source) {
    // Encode in classical base64
    encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
const encodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(data)));

let signature = encodedHeader + "." + encodedData;
signature = CryptoJS.HmacSHA256(signature, secret);
signature = base64url(signature);

const token = `${encodedHeader}.${encodedData}.${signature}`;

const eventSource = new EventSourcePolyfill(url, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
});

eventSource.onmessage = e => {
    const div = document.createElement('div');
    div.innerHTML = new Date().toISOString() + ' ' + e.lastEventId + ': ' + e.data;
    document.getElementsByTagName('body')[0].appendChild(div);
};