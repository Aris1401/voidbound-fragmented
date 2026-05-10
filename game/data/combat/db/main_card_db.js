import CardDB from "../../../system/combat/card/card_db";
import HealCard from "../card/heal_card";
import SlashCard from "../card/slash_card";

export default class MainCardDB extends CardDB {
    constructor() {
        super()

        this.register(SlashCard)
        this.register(HealCard)
    }
}