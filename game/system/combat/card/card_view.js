export default class CardView extends Phaser.GameObjects.Container {
    static CardState = {
        NORMAL: "normal",
        HOVERED: "hover",
        DRAGGED: "dragged"
    }

    constructor(scene) {
        super(scene, 0, 0)

        this.scene.add.existing(this)

        this.cardState = CardView.CardState.NORMAL

        this.lastXPosition = 0
        this.lastYPosition = 0
    }
    
    setupView(cardModel) {
        this.cardModel = cardModel

        let cardBaseImage = this.scene.add.image(0, 0, 'card_base')
        this.add(cardBaseImage)

        this.setSize(cardBaseImage.getBounds().x, cardBaseImage.getBounds().y)

        this.setInteractive(this.getBounds(), Phaser.Geom.Rectangle.Contains)

        // Loading card image
        let loader = new Phaser.Loader.LoaderPlugin(this.scene)
        
        loader.image(this.cardModel.id, `card/${ this.cardModel.id }.png`)
        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            this.cardEffectImage = this.scene.add.image(0, 0, this.cardModel.id)
            this.add(this.cardEffectImage)
        })
        loader.start()

        // Add the energy cost
        this.add(this.scene.add.text((this.getBounds().width / 2) - 20, (this.getBounds().height / 2) - 20, this.cardModel.energyCost))
    }
}