import CardPile from "../../../../system/combat/card/card_pile";
import PlayerCombatState from "../../../../system/combat/player/player_combat_state";
import EntityStats from "../../../../system/combat/stats/entity_stats";

export default class PlayerStats extends EntityStats {
    constructor() {
        super()
    
        this.currency = 0;

        this.deck = new CardPile();
        this.relics = [];

        this.playerCombatState = null;
    }

    setupCombat() {
        this.playerCombatState = new PlayerCombatState();

        for (let i = 0; i < this.deck.cards.length; i++) {
            this.playerCombatState.drawPile.push(this.deck.cards[i])
        }
    }
}