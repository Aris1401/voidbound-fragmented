import CardPile from "../card/card_pile";

export default class PlayerCombatState {
    static Events = {
        ENERGY_CHANGED: "energy_changed"
    }

    constructor() {
        this.hand = new CardPile(5, true);
        this.discardPile = new CardPile();
        this.drawPile = new CardPile();

        this.maxEnergy = 5
        this.energy = 5

        this.events = new Phaser.Events.EventEmitter()
    }

    loseEnergy(amount) {
        if (amount < 0) amount = 0;

        this.energy -= amount;

        this.events.emit(PlayerCombatState.Events.ENERGY_CHANGED, this.energy, this.maxEnergy)
    }

    gainEnergy(amount) {
        this.energy += amount

        this.events.emit(PlayerCombatState.Events.ENERGY_CHANGED, this.energy, this.maxEnergy)
    }

    gainMaxEnergy() {
        this.energy += this.maxEnergy

        this.events.emit(PlayerCombatState.Events.ENERGY_CHANGED, this.energy, this.maxEnergy)
    }
} 