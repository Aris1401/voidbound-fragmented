export default class CardPile {
    static Events = {
        PILE_CHANGED: "pile_changed",
        CARD_ADDED: "card_added",
        CARD_REMOVED: "card_removed"
    }

    constructor(pileSize = 5, pileSizeRestricted = false) {
        this.pileSize = pileSize;
        this.pileSizeRestricted = pileSizeRestricted;

        this.cards = []

        this.events = new Phaser.Events.EventEmitter();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    push(card) {
        if (this.pileSizeRestricted) {
            if (this.cards.length + 1 > this.pileSize) return false;
        }

        if (card == undefined) return;

        card.pile = this;

        this.cards.push(card)

        this.events.emit(CardPile.Events.CARD_ADDED, card)
        this.events.emit(CardPile.Events.PILE_CHANGED, this.cards)

        return true
    }

    remove(card) {
        let cardIndex = this.cards.indexOf(card)
        if (cardIndex > -1) {
            this.cards.splice(cardIndex, 1)
        }

        this.events.emit(CardPile.Events.CARD_REMOVED, card)
        this.events.emit(CardPile.Events.PILE_CHANGED, this.cards)
    }

    popFront() {
        let card = this.cards.shift()

        this.events.emit(CardPile.Events.PILE_CHANGED, this.cards)

        return card
    }

    size() {
        return this.cards.length
    }

    clear() {
        this.cards = []

        this.events.emit(CardPile.Events.PILE_CHANGED, this.cards)
    }
}