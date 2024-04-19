<script lang="ts">
    import * as Tone from "tone";
    import AudioMotionAnalyzer from "audiomotion-analyzer";
	import {FindClosestNoteForFrequency} from "../NoteFrequencies";
	import { Oscilloscope } from "@teropa/oscilloscope";
    let UserHasInteracted: boolean = false;
    let Osc: Tone.Oscillator;
    let Viz: AudioMotionAnalyzer;
	let WaveFormViz: Oscilloscope;
	let FundFreqLinear = 8967;
    $: FundFreq = LinearToLog(FundFreqLinear);
	$: {
		if (Osc) {
			Osc.frequency.value = FundFreq;
		}
	}
	let Partials = [1,0,0,0,0,0];
	$: {
		if (Osc) {
			
			Osc.partials = [...Partials];
		}
		
	}
    function InitAudio() {
        if (Osc || Viz) return;
        UserHasInteracted = true;
        Osc = new Tone.Oscillator(440).toDestination().start();
        Osc.partialCount = 3;
        Viz = new AudioMotionAnalyzer(document.getElementById("visualizer")!, {
            source: Osc.output as AudioNode,
            fftSize: 32768,
            mode: 0,
            smoothing: 0,
			showScaleX: true,
			showScaleY: true
        });
		WaveFormViz = new Oscilloscope(document.getElementById("osc") as any,Tone.getContext() as any,{
			fftSize: 32768
		});
		WaveFormViz.connect(Osc.output as any);
		WaveFormViz.start();
    }
	function LogToLinear(x: number) {
		const min = 20;
        const max = 20_000;
        const scale = (Math.log(max) - Math.log(min)) / (max - min);
		return min + (Math.log(x) - Math.log(min)) / scale;
	}
    function LinearToLog(x: number): number {
        const min = 20;
        const max = 20_000;
        const scale = (Math.log(max) - Math.log(min)) / (max - min);
        return Math.floor(Math.exp((x - min) * scale + Math.log(min)));
    }
</script>

<button
    on:click={() => InitAudio()}
    style:display={UserHasInteracted ? "none" : undefined}
    >Start Visualizer</button>
<div id="show-when-ready" style:display={UserHasInteracted ? "flex" : "none"}>
    <label id="osc-freq-label" for="osc-freq"
        >Fundamental Frequency (Hz): <input type="number" value={FundFreq} on:change={(event) => {FundFreqLinear = Math.min(20_000,Math.max(0,Math.ceil(LogToLinear(parseInt(event.target.value)))))}}>({FindClosestNoteForFrequency(FundFreq)})
    </label>
    <input type="range" id="osc-freq" min="0" max="19980" bind:value={FundFreqLinear} />
    <fieldset>
        <legend>Harmonics:</legend>
        {#each Array.from({length: Partials.length-1}, (_,i) => i+1 ) as partial}
            <label>
                <input type="checkbox" name="harmonic-{partial+1}" checked={false} on:change={(event) => {Partials[partial] = (event.target.checked) ? 1 : 0; Partials = Partials; console.log(Partials);}} />
                Harmonic {partial+1} (Hz): {FundFreq*(partial+1)} ({FindClosestNoteForFrequency(FundFreq*(partial+1))})
            </label>
        {/each}
    </fieldset>
	<h3>Spectral Analyzer</h3>
    <div id="visualizer" style="height: 250px;"></div>
	<h3>Oscilloscope</h3>
	<canvas id="osc" style="height: 250px; width:100%;"></canvas>
</div>

<style>
    #show-when-ready {
        flex-direction: column;
        height: 100%;
    }
</style>
