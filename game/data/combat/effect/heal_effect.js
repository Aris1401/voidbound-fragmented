import Effect from "../../../system/combat/effect/effect"

export default class HealEffect extends Effect{
    constructor(healAmount = 1) {
        super()
        this.healAmount = healAmount
    }

    process(stats) {
        stats.heal(this.healAmount);
    }
}