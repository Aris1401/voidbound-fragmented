import DialogFactory from "./dialog/dialog_factory";

export default class StorySystem {
    static EVENTS = {
        SHOW_DIALOG: 'showDialog',
        HIDE_DIALOG: 'hideDialog'
    }

    constructor(scene, storyState, dialogDB) {
        this.scene = scene
        this.storyState = storyState
        this.dialogDB = dialogDB

        this.storyEventEmitter = new Phaser.Events.EventEmitter();
    }

    progressStory() {
        this.storyState.progressStory()
    }

    getNextDialog(npcId, updateDialogState = true) {
        let currentOrder = -1;
        if (this.storyState.dialogState[npcId] && this.storyState.dialogState[npcId][this.storyState.progression] !== undefined) {
            currentOrder = this.storyState.dialogState[npcId][this.storyState.progression];
        }

        let nextDialog = this.dialogDB.getDialog(npcId, this.storyState.progression, currentOrder);
        if (nextDialog && nextDialog.requirements()) {
            if (updateDialogState) {
                this.storyState.setDialogState(npcId, this.storyState.progression, nextDialog.order);
            }
        }

        if (!nextDialog) {
            let lastDialogOrder = currentOrder - 1;
            nextDialog = this.dialogDB.getDialog(npcId, -1, 0); // Get the default dialog for this NPC
        }

        return nextDialog;
    }
}