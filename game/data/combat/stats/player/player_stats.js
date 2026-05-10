import CardPile from "../../../../system/combat/card/card_pile";
import PlayerCombatState from "../../../../system/combat/player/player_combat_state";
import EntityStats from "../../../../system/combat/stats/entity_stats";

export default class PlayerStats extends EntityStats {
    constructor() {
        super()
    
        this.currency = 0;

        this.maxEnergy = 5

        this.deck = new CardPile();
        this.relics = [];

        this.playerCombatState = null;
    }

    setupCombat() {
        this.playerCombatState = new PlayerCombatState();
        this.playerCombatState.energy = this.maxEnergy
        this.playerCombatState.maxEnergy = this.maxEnergy

        this.playerCombatState.events.emit(PlayerCombatState.Events.ENERGY_CHANGED, this.maxEnergy, this.maxEnergy)

        for (let i = 0; i < this.deck.cards.length; i++) {
            this.deck.cards[i].playerStats = this
            this.playerCombatState.drawPile.push(this.deck.cards[i])
        }
    }
}