// KeyboardEvent.code gives a mapping from KEY POSITIONS to UNIQUE STRINGS.
//   MCU-side, friendly names will be wrong for keys in a non-QWERTY layout.
//   To detect a capital letter, MCU programmers need to check if one of the Shifts is pressed and the letter key.
// KeyboardEvent.key gives a mapping from KEY FUNCTIONS to UNIQUE STRINGS.
//   Keys whose functions are affected by Shift, Caps, Num lock will produce different outputs based on modifiers.
//   To check if a letter is pressed, MCU programmers need to check both the lowercase and uppercase letter.
// KeyboardEvent.code chosen because vast majority of people will be on QWERTY layouts and want lock-agnostic input.

// Key codes from https://w3c.github.io/uievents-code/#keyboard-key-codes
const keyToNum = {
    // Alphanumeric
    Backquote:             0,
    Backslash:             1,
    BracketLeft:           2,
    BracketRight:          3,
    Comma:                 4,
    Digit0:                5,
    Digit1:                6,
    Digit2:                7,
    Digit3:                8,
    Digit4:                9,
    Digit5:                10,
    Digit6:                11,
    Digit7:                12,
    Digit8:                13,
    Digit9:                14,
    Equal:                 15,
    IntlBackslash:         16,
    IntlRo:                17,
    IntlYen:               18,
    KeyA:                  19,
    KeyB:                  20,
    KeyC:                  21,
    KeyD:                  22,
    KeyE:                  23,
    KeyF:                  24,
    KeyG:                  25,
    KeyH:                  26,
    KeyI:                  27,
    KeyJ:                  28,
    KeyK:                  29,
    KeyL:                  30,
    KeyM:                  31,
    KeyN:                  32,
    KeyO:                  33,
    KeyP:                  34,
    KeyQ:                  35,
    KeyR:                  36,
    KeyS:                  37,
    KeyT:                  38,
    KeyU:                  39,
    KeyV:                  40,
    KeyW:                  41,
    KeyX:                  42,
    KeyY:                  43,
    KeyZ:                  44,
    Minus:                 45,
    Period:                46,
    Quote:                 47,
    Semicolon:             48,   
    Slash:                 49,

    // Functional
    AltLeft:               50,
    AltRight:              51,
    Backspace:             52,
    CapsLock:              53,
    ContextMenu:           54,
    ControlLeft:           55,
    ControlRight:          56,
    Enter:                 57,
    MetaLeft:              58,
    MetaRight:             59,
    ShiftLeft:             60,
    ShiftRight:            61,
    Space:                 62,
    Tab:                   63,

    // Control Pad
    Delete:                64,
    End:                   65,
    Help:                  66,
    Home:                  67,
    Insert:                68,
    PageDown:              69,
    PageUp:                70,
    ArrowDown:             71,
    ArrowLeft:             72,
    ArrowRight:            73,
    ArrowUp:               74,

    // Numpad
    NumLock:               75,
    Numpad0:               76,
    Numpad1:               77,
    Numpad2:               78,
    Numpad3:               79,
    Numpad4:               80,
    Numpad5:               81,
    Numpad6:               82,
    Numpad7:               83,
    Numpad8:               84,
    Numpad9:               85,
    NumpadAdd:             86,
    NumpadBackspace:       87,
    NumpadClear:           88,
    NumpadClearEntry:      89,
    NumpadComma:           90,
    NumpadDecimal:         91,
    NumpadDivide:          92,
    NumpadEnter:           93,
    NumpadEqual:           94,
    NumpadHash:            95,
    NumpadMemoryAdd:       96,
    NumpadMemoryClear:     97,
    NumpadMemoryRecall:    98,
    NumpadMemoryStore:     99,
    NumpadMemorySubtract: 100,
    NumpadMultiply:       101,
    NumpadParenLeft:      102,
    NumpadParenRight:     103,
    NumpadStar:           104,
    NumpadSubtract:       105,
};

module.exports = { keyToNum };