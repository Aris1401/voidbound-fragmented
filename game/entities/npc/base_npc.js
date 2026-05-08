import Interactable from "../../system/interaction/interactable";
import StorySystem from "../../system/story/story_system";
import Entity from "../entity";

export default class BaseNPC extends Entity {
    constructor(scene, name, id, storySystem) {
        super(scene, name);
        
        this.id = id;
        this.interactable = null;
        this.storySystem = storySystem;

        this.create();

        // NPC Data
        this.hasNextDialogue = false;

        this.interactionTextOffset = 30;
    }

    create() {
        var interactionText = this.showInteractionPrompt();
        interactionText.visible = false;

        this.interactable = new Interactable(this.scene, this.name, () => {
            this.storySystem.storyEventEmitter.emit(StorySystem.EVENTS.SHOW_DIALOG,  this.storySystem.getNextDialog(this.id) );
        }, () => {
            interactionText.visible = true;
        }, () => {
            interactionText.visible = false;

            this.storySystem.storyEventEmitter.emit(StorySystem.EVENTS.HIDE_DIALOG);
        });
    }

    showInteractionPrompt() {
        return this.scene.add.text(this.x, this.y - this.interactionTextOffset, 'Press E to interact', { fontSize: '12px', fill: '#fff' }).setDepth(2).setOrigin(0.5);
    }
}