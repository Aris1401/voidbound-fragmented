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

        this.energy_cost = 1;

        this.pile = null;

        this.targeting = CardModel.TargetType.SINGLE
    }

    getDescription() { return ""; }

    onPlay(targets) {

    }
}