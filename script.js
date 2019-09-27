"use strict";
//Global variables
//--------------------------------------------------
const harmonySelect = document.querySelector("#harmony");

window.addEventListener("load", start);

function start() {
  let colorPicker = document.querySelector("#picker");
  colorPicker.value = "#00f933";
  showColor();
  colorPicker.addEventListener("input", showColor);
  harmonySelect.addEventListener("input", showColor);
}
//display color that we choose, plus hex, rgb and hsl
//---------------------------------------------------
function showColor() {
  let colorValue = document.querySelector("#picker").value;
  document.querySelector(".selectedBaseColor").style.background = colorValue;
  showHex(colorValue, ".colorHex");
  showRgb(colorValue, ".colorRgb");
  showHsl(colorValue, ".colorHsl");
  let selected = document.querySelector("#harmony").value;
  if (selected == "complementary") {
    displayColors(colorValue, complementaryColor);
  } else if (selected == "analogous") {
    displayColors(colorValue, analogousColor);
  } else if (selected == "monochromatic") {
    displayColors(colorValue, monochromaticColor);
  } else if (selected == "triad") {
    displayColors(colorValue, triadColor);
  } else if (selected == "compound") {
    displayColors(colorValue, compoundColor);
  } else if (selected == "shades") {
    displayColors(colorValue, shadesColor);
  }
}

function showHex(color, colorClass) {
  document.querySelector(colorClass).innerHTML = color;
}
function showRgb(color, colorClass) {
  document.querySelector(colorClass).innerHTML = "RGB(" + HexToRGB(color) + ")";
}
function showHsl(color, colorClass) {
  document.querySelector(colorClass).innerHTML = "HSL(" + RGBToHSL(color) + ")";
}
function displayColors(color, harmony) {
  let hslArray = harmony(color);
  let hsl;
  let hex;
  for (let i = 0; i < 4; i++) {
    hsl = hslArray[i];
    hex = HSLToHex(hsl);
    document.querySelector(".color" + (i + 1)).style.background = hex;
    showHex(hex, ".color" + (i + 1) + "Hex");
    showHsl(hex, ".color" + (i + 1) + "Hsl");
    showRgb(hex, ".color" + (i + 1) + "Rgb");
  }
}
//Convert HEX to RGB
//-----------------------------------------------------
function HexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }
  return +r + "," + +g + "," + +b;
}
//Convert RGB to HSL
//-----------------------------------------------------
function RGBToHSL(H) {
  let rgb = HexToRGB(H); //rgb is 3 numbers separated by commas
  let rgbValues = rgb.split(","); //rgbValues has the three numbers that we need

  //Make r, g, and b fractions of 1
  let r = rgbValues[0] / 255;
  let g = rgbValues[1] / 255;
  let b = rgbValues[2] / 255;

  //Find the greatest and smallest values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  s = Math.round(s);
  l = Math.round(l);

  return +h + ", " + s + "%, " + l + "%";
}

//convert HSL to HEX
//--------------------------------------------------
function HSLToHex(hsl) {
  let h = hsl.h;
  let s = hsl.s;
  let l = hsl.l;
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
//function to break hsl into h,s,l numbers
//-----------------------------------------------
function parseHSL(str) {
  let hsl = str.replace(/[^\d,.]/g, "").split(","); // strip non digits ('%')
  const h = Number(hsl[0]); // convert to number
  const s = Number(hsl[1]);
  const l = Number(hsl[2]);
  return [h, s, l];
}
//function to calculate complementary color
//-----------------------------------------------
function complementaryColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h: h, s, l: (l + 40) % 100 };
  let hsl2 = { h: h, s, l: (l + 20) % 100 };
  let hsl3 = { h: (h + 180) % 360, s, l: (l + 20) % 100 };
  let hsl4 = { h: (h + 180) % 360, s, l };

  return [hsl1, hsl2, hsl3, hsl4];
}
//function to calculate analogous color
//------------------------------------------------
function analogousColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h: (h - 40) % 360, s, l };
  let hsl2 = { h: (h - 20) % 360, s, l };
  let hsl3 = { h: (h + 20) % 360, s, l };
  let hsl4 = { h: (h + 40) % 360, s, l };

  return [hsl1, hsl2, hsl3, hsl4];
}
//function to calculate monochromatic color
//------------------------------------------------
function monochromaticColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h, s, l: (l - 20) % 100 };
  console.log(hsl1);

  let hsl2 = { h, s, l: (l - 10) % 100 };
  console.log(hsl2);
  let hsl3 = { h, s, l: (l + 10) % 100 };
  let hsl4 = { h, s, l: (l + 20) % 100 };

  return [hsl1, hsl2, hsl3, hsl4];
}
//function to calculate triad color
//-------------------------------------------------
function triadColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h: (h + 120) % 360, s, l: (l + 20) % 100 };
  let hsl2 = { h: (h + 120) % 360, s, l };
  let hsl3 = { h: (h + 240) % 360, s, l };
  let hsl4 = { h: (h + 240) % 360, s, l: (l - 20) % 100 };

  return [hsl1, hsl2, hsl3, hsl4];
}
//function to calculate compound color
//---------------------------------------------------
function compoundColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h: (h + 180) % 360, s, l }; //complementary color
  let hsl2 = { h: (h + 160) % 360, s, l }; //adjacent to complementary color
  let hsl3 = { h: (h + 20) % 360, s, l }; //adjacent to complementary color
  let hsl4 = { h: (h + 20) % 360, s, l: (l - 20) % 100 }; //shade of adjacent to base color

  return [hsl1, hsl2, hsl3, hsl4];
}
//function to calculate shades of a color
//---------------------------------------------------
function shadesColor(baseColor) {
  let hslBaseColor = RGBToHSL(baseColor);
  const [h, s, l] = parseHSL(hslBaseColor);
  let hsl1 = { h, s: (s - 20) % 100, l };
  let hsl2 = { h, s: (s - 10) % 100, l };
  let hsl3 = { h, s: (s + 10) % 100, l };
  let hsl4 = { h, s: (s + 20) % 100, l };

  return [hsl1, hsl2, hsl3, hsl4];
}
