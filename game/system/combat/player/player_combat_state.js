import CardPile from "../card/card_pile";

export default class PlayerCombatState {
    constructor() {
        this.hand = new CardPile(5, true);
        this.discardPile = new CardPile();
        this.drawPile = new CardPile();
    }
}