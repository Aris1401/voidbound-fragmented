import Interactable from "../../system/interaction/interactable";
import Entity from "../entity";

export default class BaseNPC extends Entity {
    constructor(scene, name, id) {
        super(scene, name);
        
        this.id = id;
        this.interactable = null;

        this.create();

        // NPC Data
        this.hasNextDialogue = false;

        this.interactionTextOffset = 30;
    }

    create() {
        var interactionText = this.showInteractionPrompt();
        interactionText.visible = false;

        this.interactable = new Interactable(this.scene, this.name, () => {
            console.log(`Interacted with NPC ${this.name}`);
        }, () => {
            interactionText.visible = true;
        }, () => {
            interactionText.visible = false;
        });
    }

    showInteractionPrompt() {
        return this.scene.add.text(this.x, this.y - this.interactionTextOffset, 'Press E to interact', { fontSize: '12px', fill: '#fff' }).setDepth(2).setOrigin(0.5);
    }
}