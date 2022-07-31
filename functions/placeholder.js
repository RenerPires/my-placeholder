const cloudinary = require('cloudinary')

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h,s,l]
}

cloudinary.config({ 
    cloud_name: 'renerpires'
})

exports.handler = async (event, context) => {
    const {path} = event
    const paramsPath = path.replace('/p/', '')
    const [width, height, background] = paramsPath.split('/').filter(param => !!param);

    const url = cloudinary.url( "placeholder", {
        background: `#${background}`,
        height: height,
        width: width,
        crop: "mpad",
        transformation: [
            {
                overlay: {font_family: "Montserrat",
                font_size: Math.min(50, Math.max(height/10, width/10)),
                text: `${width} x ${height}`},
                color: hexToHSL(`#${background}`)[2] < 50 ? "#fff" : "#000"
            },
            {flags: "layer_apply"}
        ]
    })

    console.log({width, height, background, url});
    return {
        // statusCode: 200,
        // body: `<html><body><img src="${url}"></body></html>`
        statusCode: 302,
        headers: {
            Location: url
        }
    }
}