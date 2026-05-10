import CardModel from "../../../system/combat/card/card_model";

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
        console.log("Slashed targets")
    }
}