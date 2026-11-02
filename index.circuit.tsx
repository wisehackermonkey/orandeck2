/**
 * ESP32-S3-MINI-1-N8 + microSD + 20x2 character LCD + USB-C keyboard host port
 * 2-layer board.
 *
 * BEFORE BUILDING: import the real footprints/pinouts of the JLCPCB parts:
 *   tsci import C2913206   (ESP32-S3-MINI-1-N8)
 *   tsci import C165948    (USB-C)
 *   tsci import C2837407   (3.3V regulator)
 *   tsci import C965799    (red LED)
 *   tsci import C91145     (microSD socket TF-01A, suggested)
 * Then replace the `footprint=` of the chips below with the imported ones
 * (or swap the chips for the imported components) and confirm pin labels.
 */

// Placeholder pin labels; verify against the imported parts / datasheets.
const ESP_PINS = {
  pin1: ["GND"],
  pin3: ["V3V3"],
  pin4: ["IO0"],
  pin12: ["EN"],
  pin5: ["IO1"],
  pin6: ["IO2"],
  pin7: ["IO3"],
  pin8: ["IO4"],
  pin9: ["IO5"],
  pin10: ["IO6"],
  pin11: ["IO7"],
  pin13: ["IO8"],
  pin14: ["IO9"],
  pin15: ["IO10"],
  pin16: ["IO11"],
  pin17: ["IO12"],
  pin18: ["IO13"],
  pin19: ["IO14"],
  pin20: ["IO15"],
  pin21: ["IO16"],
  pin22: ["IO17"],
  pin23: ["IO18"],
  pin24: ["IO19"], // USB D-
  pin25: ["IO20"], // USB D+
  pin26: ["IO21"],
} as const

export default () => (
  <board width="80mm" height="55mm" layers={2}>
    {/* ───────── MCU ───────── */}
    <chip
      name="U1"
      manufacturerPartNumber="ESP32-S3-MINI-1-N8"
      supplierPartNumbers={{ jlcpcb: ["C2913206"] }}
      footprint="soic8" /* TODO: replace with imported ESP32-S3-MINI-1 footprint */
      pinLabels={ESP_PINS as any}
      pcbX={0}
      pcbY={5}
      schPinArrangement={{
        leftSide: { direction: "top-to-bottom", pins: ["V3V3", "EN", "IO0"] },
        rightSide: {
          direction: "top-to-bottom",
          pins: [
            "IO1", "IO2", "IO3", "IO4", "IO5", "IO6", "IO7",
            "IO8", "IO9", "IO10", "IO11", "IO12", "IO13", "IO14",
            "IO15", "IO16", "IO17", "IO18", "IO19", "IO20", "IO21",
          ],
        },
        bottomSide: { direction: "left-to-right", pins: ["GND"] },
      }}
    />

    {/* ───────── Power: USB-C #1 (power / programming) → 5V → 3V3 ───────── */}
    <chip
      name="J1"
      manufacturerPartNumber="USB-C (programming/power)"
      supplierPartNumbers={{ jlcpcb: ["C165948"] }}
      footprint="soic8" /* TODO: imported USB-C footprint */
      pinLabels={{
        pin1: ["VBUS"], pin2: ["GND"], pin3: ["CC1"], pin4: ["CC2"],
        pin5: ["DP"], pin6: ["DN"], pin7: ["SHELL"],
      }}
      pcbX={-30}
      pcbY={-22}
    />
    <resistor name="R_CC1_A" resistance="5.1k" footprint="0402" pcbX={-24} pcbY={-14} />
    <resistor name="R_CC2_A" resistance="5.1k" footprint="0402" pcbX={-22} pcbY={-14} />

    <chip
      name="U2"
      manufacturerPartNumber="Reg5vTo3v3"
      supplierPartNumbers={{ jlcpcb: ["C2837407"] }}
      footprint="sot23" /* TODO: imported regulator footprint */
      pinLabels={{ pin1: ["VIN"], pin2: ["GND"], pin3: ["VOUT"] }}
      pcbX={-30}
      pcbY={-5}
    />
    <capacitor name="C_IN" capacitance="10uF" footprint="0805" pcbX={-36} pcbY={-5} />
    <capacitor name="C_OUT" capacitance="10uF" footprint="0805" pcbX={-24} pcbY={-5} />
    <capacitor name="C_MCU" capacitance="100nF" footprint="0402" pcbX={-10} pcbY={14} />

    {/* ───────── USB-C #2: host port for USB keyboard ───────── */}
    <chip
      name="J2"
      manufacturerPartNumber="USB-C (keyboard host)"
      supplierPartNumbers={{ jlcpcb: ["C165948"] }}
      footprint="soic8" /* TODO: imported USB-C footprint */
      pinLabels={{
        pin1: ["VBUS"], pin2: ["GND"], pin3: ["CC1"], pin4: ["CC2"],
        pin5: ["DP"], pin6: ["DN"], pin7: ["SHELL"],
      }}
      pcbX={30}
      pcbY={-22}
    />
    {/* Rp pull-ups to 3V3 on CC lines: tells a USB-C keyboard "I'm a host" (22k = 1.5A) */}
    <resistor name="R_CC1_B" resistance="22k" footprint="0402" pcbX={24} pcbY={-14} />
    <resistor name="R_CC2_B" resistance="22k" footprint="0402" pcbX={22} pcbY={-14} />
    <capacitor name="C_VBUS2" capacitance="10uF" footprint="0805" pcbX={36} pcbY={-14} />

    {/* ───────── microSD (SPI mode) ───────── */}
    <chip
      name="J3"
      manufacturerPartNumber="TF-01A microSD"
      supplierPartNumbers={{ jlcpcb: ["C91145"] }}
      footprint="soic8" /* TODO: imported microSD footprint */
      pinLabels={{
        pin1: ["DAT2"], pin2: ["CS"], pin3: ["MOSI"], pin4: ["VDD"],
        pin5: ["SCK"], pin6: ["GND"], pin7: ["MISO"], pin8: ["DAT1"],
      }}
      pcbX={-28}
      pcbY={20}
    />
    <capacitor name="C_SD" capacitance="100nF" footprint="0402" pcbX={-20} pcbY={20} />

    {/* ───────── 20x2 character LCD (HD44780, 4-bit, 16-pin header) ───────── */}
    <pinheader
      name="J4"
      pinCount={16}
      pitch="2.54mm"
      gender="male"
      showSilkscreenPinLabels
      pcbX={25}
      pcbY={18}
      pcbRotation={90}
      pinLabels={{
        pin1: "VSS", pin2: "VDD", pin3: "V0", pin4: "RS", pin5: "RW", pin6: "E",
        pin7: "D0", pin8: "D1", pin9: "D2", pin10: "D3",
        pin11: "D4", pin12: "D5", pin13: "D6", pin14: "D7",
        pin15: "LEDA", pin16: "LEDK",
      }}
    />
    {/* contrast pot on V0 */}
    <potentiometer name="RV1" maxResistance="10k" footprint="pinrow3" pcbX={12} pcbY={22} />
    {/* backlight resistor (5V backlight) */}
    <resistor name="R_BL" resistance="100" footprint="0805" pcbX={12} pcbY={14} />

    {/* ───────── Red status LED ───────── */}
    <led
      name="LED1"
      color="red"
      supplierPartNumbers={{ jlcpcb: ["C965799"] }}
      footprint="0603" /* TODO: imported footprint for C965799 */
      pcbX={-8}
      pcbY={-20}
    />
    <resistor name="R_LED" resistance="1k" footprint="0402" pcbX={-3} pcbY={-20} />

    {/* ───────── Reset / boot circuitry ───────── */}
    <resistor name="R_EN" resistance="10k" footprint="0402" pcbX={-10} pcbY={-12} />
    <capacitor name="C_EN" capacitance="1uF" footprint="0402" pcbX={-14} pcbY={-12} />
    <pushbutton name="SW_BOOT" footprint="pushbutton" pcbX={8} pcbY={-20} />
    <pushbutton name="SW_RST" footprint="pushbutton" pcbX={14} pcbY={-20} />

    {/* ═════════ CONNECTIONS ═════════ */}

    {/* Power: USB-C #1 VBUS → 5V → regulator → 3V3 */}
    <trace from=".J1 > .VBUS" to="net.V5" />
    <trace from=".J1 > .GND" to="net.GND" />
    <trace from=".J1 > .SHELL" to="net.GND" />
    <trace from=".J1 > .CC1" to=".R_CC1_A > .pin1" />
    <trace from=".R_CC1_A > .pin2" to="net.GND" />
    <trace from=".J1 > .CC2" to=".R_CC2_A > .pin1" />
    <trace from=".R_CC2_A > .pin2" to="net.GND" />

    <trace from=".U2 > .VIN" to="net.V5" />
    <trace from=".U2 > .GND" to="net.GND" />
    <trace from=".U2 > .VOUT" to="net.V3V3" />
    <trace from=".C_IN > .pin1" to="net.V5" />
    <trace from=".C_IN > .pin2" to="net.GND" />
    <trace from=".C_OUT > .pin1" to="net.V3V3" />
    <trace from=".C_OUT > .pin2" to="net.GND" />
    <trace from=".C_MCU > .pin1" to="net.V3V3" />
    <trace from=".C_MCU > .pin2" to="net.GND" />

    {/* MCU power */}
    <trace from=".U1 > .V3V3" to="net.V3V3" />
    <trace from=".U1 > .GND" to="net.GND" />

    {/* USB #1 data → programming/serial (native USB: IO19=D-, IO20=D+) */}
    {/* NOTE: only one USB device can use IO19/IO20 as native USB. The keyboard
        host port (J2) uses them; J1 is power-only unless you add a USB mux
        or use the UART0 pins with a USB-UART bridge for programming. */}
    <trace from=".J2 > .DN" to=".U1 > .IO19" />
    <trace from=".J2 > .DP" to=".U1 > .IO20" />

    {/* USB #2 host port (keyboard) */}
    <trace from=".J2 > .VBUS" to="net.V5" />
    <trace from=".C_VBUS2 > .pin1" to="net.V5" />
    <trace from=".C_VBUS2 > .pin2" to="net.GND" />
    <trace from=".J2 > .GND" to="net.GND" />
    <trace from=".J2 > .SHELL" to="net.GND" />
    <trace from=".J2 > .CC1" to=".R_CC1_B > .pin1" />
    <trace from=".R_CC1_B > .pin2" to="net.V3V3" />
    <trace from=".J2 > .CC2" to=".R_CC2_B > .pin1" />
    <trace from=".R_CC2_B > .pin2" to="net.V3V3" />

    {/* microSD over SPI: CS=IO10 MOSI=IO11 SCK=IO12 MISO=IO13 */}
    <trace from=".J3 > .VDD" to="net.V3V3" />
    <trace from=".J3 > .GND" to="net.GND" />
    <trace from=".C_SD > .pin1" to="net.V3V3" />
    <trace from=".C_SD > .pin2" to="net.GND" />
    <trace from=".J3 > .CS" to=".U1 > .IO10" />
    <trace from=".J3 > .MOSI" to=".U1 > .IO11" />
    <trace from=".J3 > .SCK" to=".U1 > .IO12" />
    <trace from=".J3 > .MISO" to=".U1 > .IO13" />

    {/* LCD 20x2, 4-bit mode: RS=IO4 E=IO5 D4..D7=IO6..IO9, RW tied to GND */}
    <trace from=".J4 > .VSS" to="net.GND" />
    <trace from=".J4 > .VDD" to="net.V5" />
    <trace from=".J4 > .V0" to=".RV1 > .pin2" />
    <trace from=".RV1 > .pin1" to="net.V5" />
    <trace from=".RV1 > .pin3" to="net.GND" />
    <trace from=".J4 > .RW" to="net.GND" />
    <trace from=".J4 > .RS" to=".U1 > .IO4" />
    <trace from=".J4 > .E" to=".U1 > .IO5" />
    <trace from=".J4 > .D4" to=".U1 > .IO6" />
    <trace from=".J4 > .D5" to=".U1 > .IO7" />
    <trace from=".J4 > .D6" to=".U1 > .IO8" />
    <trace from=".J4 > .D7" to=".U1 > .IO9" />
    <trace from=".J4 > .LEDA" to=".R_BL > .pin1" />
    <trace from=".R_BL > .pin2" to="net.V5" />
    <trace from=".J4 > .LEDK" to="net.GND" />

    {/* Red indicator LED on IO14 */}
    <trace from=".U1 > .IO14" to=".R_LED > .pin1" />
    <trace from=".R_LED > .pin2" to=".LED1 > .anode" />
    <trace from=".LED1 > .cathode" to="net.GND" />

    {/* EN reset RC + buttons */}
    <trace from=".R_EN > .pin1" to="net.V3V3" />
    <trace from=".R_EN > .pin2" to=".U1 > .EN" />
    <trace from=".C_EN > .pin1" to=".U1 > .EN" />
    <trace from=".C_EN > .pin2" to="net.GND" />
    <trace from=".SW_RST > .pin1" to=".U1 > .EN" />
    <trace from=".SW_RST > .pin2" to="net.GND" />
    <trace from=".SW_BOOT > .pin1" to=".U1 > .IO0" />
    <trace from=".SW_BOOT > .pin2" to="net.GND" />
  </board>
)