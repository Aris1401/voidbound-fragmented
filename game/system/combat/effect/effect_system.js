export default class EffectSystem {
    constructor(stats) {
        this.stats = stats
    }

    process(effect) {
        effect.process(this.stats)
    }
}