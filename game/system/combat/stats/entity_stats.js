import EffectSystem from "../effect/effect_system";

export default class EntityStats {
    static Events = {
        HEALTH_CHANGED: "health_changed",
        TOOK_DAMAGE: "took_damage",
        DIED: "died"
    }

    constructor() {
        this.maxHp = 0;
        this.hp = 0;

        this.block = 0;

        this.effectSystem = new EffectSystem(this);

        this.statsEventEmitter = new Phaser.Events.EventEmitter();
    }

    takeDamage(amount) {
        if (amount < 0) amount = 0;

        this.hp -= amount;

        if (this.hp < 0) {
            this.statsEventEmitter.emit(EntityStats.Events.DIED)
            this.hp = 0;
        }

        if (amount > 0) this.statsEventEmitter.emit(EntityStats.Events.TOOK_DAMAGE, amount)
        this.statsEventEmitter.emit(EntityStats.Events.HEALTH_CHANGED, { currentHp: this.hp })
    }
}