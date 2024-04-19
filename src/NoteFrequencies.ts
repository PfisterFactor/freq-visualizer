const NoteFrequencies = {
    "C": 261.63,
    "C#/Db": 277.18,
    "D": 293.66,
    "D#/Eb": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#/Gb": 369.99,
    "G": 392,
    "G#/Ab": 415.30,
    "A": 440,
    "A#/Bb": 466.16,
    "B": 493.88,
} as const;

function GetNoteFreqAtOctave(oct: number, note: keyof typeof NoteFrequencies): number {
    if (oct < 0 || oct > 8) throw new Error("Octave must be between 0 and 8 inclusive");
    return (NoteFrequencies[note])/(Math.pow(2,4))*Math.pow(2,oct);
}

export function FindClosestNoteForFrequency(freq: number): string {
    let minFreqDiff = 9999999;
    let closestOctave = null;
    let closestNote;
    for (let oct = 0; oct <= 8; oct++) {
        for (const note of Object.keys(NoteFrequencies)) {
            const noteFreq = GetNoteFreqAtOctave(oct,note as any);
            const diff = Math.abs(freq-noteFreq);
            if (diff <= minFreqDiff) {
                minFreqDiff = diff;
                closestOctave = oct;
                closestNote = note as keyof typeof NoteFrequencies;
            }
        }
    }
    if (Math.log(minFreqDiff) < 1) return `${minFreqDiff < Number.EPSILON ? "" : "~"}${closestNote}${closestOctave}` as any;
    return "---";
}