import Effect from "../../../system/combat/effect/effect"

export default class DamageEffect extends Effect{
    constructor(damageAmount = 1) {
        super()
        this.damageAmount = damageAmount
    }

    process(stats) {
        stats.takeDamage(this.damageAmount);
    }
}