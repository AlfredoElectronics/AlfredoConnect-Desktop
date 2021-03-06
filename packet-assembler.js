/**
 * Assembles a UTF-8 string packet to be sent encoding keyboard and gamepad state data.
 * Packet format:
 *   1 byte is hash symbol (#, 35) for packet identification
 *   1 byte for number of keys pressed
 *   1 byte per key pressed, with keys represented as bytes as in ./keyboard-code-map.js
 *   1 byte stores number of enabled gamepads
 *   For each gamepad:
 *     1 byte stores axis count
 *     1 byte for each axis, with -1..1 mapped to 0..255 and 127 representing 0
 *     1 byte stores button count
 *     1 bit for each button
 *     Pad to the next byte, then begin next gamepad
 *   1 byte is dollar sign ($, 36) for packet validation
 * 
 * NOTE: The hash symbol is included at the start of each packet so the receiver can differentiate
 * between AlfredoConnect packets and potential human input. This way, we can ensure the receiver
 * doesn't mistake human input for AlfredoConnect packets, and allows an interface on the receiver
 * to expose non-AlfredoConnect messages to the programmer. A user should not be allowed to enter
 * a hash symbol into the AlfredoConnect input window unless an advanced option with a warning is
 * selected.
 * 
 * NOTE: The dollar sign is included at the end of the packet to help protect against invalid
 * packets created by UART buffer overflows. If a sent packet is truncated by the end of the buffer
 * and then pieces of a new packet are appended to the end once the buffer starts to clear, it
 * could be interpreted as a real packet. Adding a dollar sign at the end means that an invalid
 * packet might still be read, but if it doesn't end with a dollar sign in the expected location,
 * it will be discarded. We can't get away with throwing away the packet if we see a new hash symbol
 * mid-packet because the hash symbol can come up in the middle of a packet (# = 35).
 * Possible failures that can still occur: if packets aren't sent atomically, a packet could be
 * truncated, with a hash at the start, and once the buffer clears, a packet that was mid-send
 * could be appended to it, creating an invalid packet with a starting hash and ending dollar sign.
 * 
 * NOTE: GamepadButtons support analog buttons, like triggers, with a double GamepadButton.value,
 * but there's no way to know a button is analog until the button reads a non-integer value.
 * It seems like to support them well, every button would need to always be sent as a full byte,
 * which would blow up packet size. Therefore, the current implementation treats analog buttons
 * as digital.
 * 
 * NOTE: Behaviour undefined if keysPressed, gamepads, or the axes or buttons of any gamepads have
 * more than 255 elements.
 * 
 * @param {Uint8Array} keysPressed an array of bytes corresponding to pressed keys
 * @param {Gamepad[]} gamepads
 */
function assemblePacket(keysPressed, gamepads) {
    let packetLength = 4 + keysPressed.length;
    gamepads.forEach((gamepad) => {
        packetLength += 2 + gamepad.axes.length + Math.ceil(gamepad.buttons.length / 8);
    });
    let rawPacket = new Uint8Array(packetLength);
    let i = 0;
    rawPacket[i++] = 35; // hash symbol (#)
    rawPacket[i++] = keysPressed.length;
    keysPressed.forEach(key => rawPacket[i++] = key);
    rawPacket[i++] = gamepads.length;
    gamepads.forEach((gamepad) => {
        rawPacket[i++] = gamepad.axes.length;
        gamepad.axes.forEach((axis) => {
            if (axis == 0) rawPacket[i++] = 127;
            else rawPacket[i++] = Math.round((axis + 1) * (255 / 2));
        });
        rawPacket[i++] = gamepad.buttons.length;
        let bit = 0;
        rawPacket[i] = 0;
        gamepad.buttons.forEach((button) => {
            if (button.pressed) rawPacket[i] = rawPacket[i] | (1 << bit);
            if (++bit == 8) {
                bit = 0;
                i++;
                rawPacket[i] = 0;
            }
        });
        if (bit != 0) i++;
    });
    rawPacket[i++] = 36; // dollar sign ($)
    return rawPacket;
}

/**
 * Assembles a UTF-8 string packet to be sent encoding keyboard and gamepad state data.
 * Packet format:
 *   13 bytes and 1 bit store keyboard state, with each key mapped to a bit as in ./keyboard-code.map.js
 *   High-order 7 bits of 14th byte store gamepad count (up to 127).
 *   For each gamepad:
 *     1st and 2nd bytes store axis and button count, respectively
 *     1 byte for each axis, with -1..1 mapped to 0..255 and 127 representing 0
 *     1 bit for each button
 *     Pad to the next byte, then begin next gamepad
 * 
 * NOTE: This function takes the keyboard state as a Uint8Array of 14 bytes, with each bit representing
 * the state of a keyboard key. This function was deprecated because this keyboard representation always
 * takes 14 bytes, but the other representation takes 1 byte per key pressed, which gives a lower packet
 * size for up to 13 pressed keys (far above typical use). Although the 14-byte fixed-width keyboard state
 * could be made smaller, it would never reach the around 5-byte representation that we would expect to see 
 * at maximum during normal use from the other technique.
 * 
 * @param {Uint8Array} keyboardState
 * @param {Gamepad[]} gamepads
 * @deprecated because packet representation size has been reduced
 */
function assembleFixedWidthPacket(keyboardState, gamepads) {
    let packetLength = keyboardState.length;
    gamepads.forEach((gamepad) => {
        packetLength += 2 + gamepad.axes.length + Math.ceil(gamepad.buttons.length / 8);
    });
    let rawPacket = new Uint8Array(packetLength);
    keyboardState.forEach((value, i) => { rawPacket[i] = value; });
    
    // Use the unused high-order 7 bits of the keyboard state to store the number of gamepads
    if (gamepads.length > 127) return;
    rawPacket[13] = rawPacket[13] | (gamepads.length << 1);

    let byte = 14;
    gamepads.forEach((gamepad) => {
        if (gamepad.axes.length > 255) return;
        rawPacket[byte++] = gamepad.axes.length;
        rawPacket[byte++] = gamepad.buttons.length;
        gamepad.axes.forEach((axis) => {
            if (axis == 0) rawPacket[byte++] = 127;
            else rawPacket[byte++] = (axis + 1) * (255 / 2);
        });
        let bit = 0;
        gamepad.buttons.forEach((button) => {
            if (button.pressed) rawPacket[byte] = rawPacket[byte] | (1 << bit);
            if (++bit == 8) {
                bit = 0;
                byte++;
            }
        });
        byte++;
    });
    return Buffer.from(rawPacket).toString("utf-8");
}

module.exports.assemblePacket = assemblePacket;