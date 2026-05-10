export default class CardModel {
    static TargetType = {
        SELF: "self",
        SINGLE: "single",
        MULTIPLE: "mulitple",
        ALL: "all"
    }

    constructor() {
        this.id = "";
        this.name = "";

        this.energyCost = 1;

        this.pile = null;

        this.targeting = CardModel.TargetType.SINGLE

        this.playerStats = null;
    }

    getDescription() { return ""; }

    canPlay() {
        let result = this.playerStats.playerCombatState.energy - this.energyCost

        return result > 0
    }

    onPlay(targets) {

    }

    afterPlay() {
        this.spendResources()
    }

    spendResources() {
        this.playerStats.playerCombatState.loseEnergy(this.energyCost)
    }
}