import CardModel from "../../../system/combat/card/card_model";
import HealEffect from "../effect/heal_effect";

export default class HealCard extends CardModel {
    constructor() {
        super()

        this.id = "heal"
        this.name = "Heal"

        this.energyCost = 4

        this.targeting = CardModel.TargetType.SELF

        this.healAmount = 30;
    }

    getDescription() {
        return `Heals a total of ${ this.slashDamage } to player.`
    }

    onPlay(targets) {
        targets.forEach((target) => {
            let healEffect = new HealEffect(this.healAmount)

            target.effectSystem.process(healEffect)
        })
    }
}