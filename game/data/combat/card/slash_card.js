import CardModel from "../../../system/combat/card/card_model";
import DamageEffect from "../effect/damage_effect";

export default class SlashCard extends CardModel {
    constructor() {
        super()

        this.id = "slash"
        this.name = "Slash"
        this.description = "Deals an amount"

        this.targeting = CardModel.TargetType.SINGLE

        this.slashDamage = 5;
    }

    getDescription() {
        return `Deals a total of ${ this.slashDamage } to a single enemy.`
    }

    onPlay(targets) {
        targets.forEach((target) => {
            let damageEffect = new DamageEffect(this.slashDamage)

            target.effectSystem.process(damageEffect)
        })
    }
}