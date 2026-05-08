export default class DialogDB {
    constructor() {
        this.dialogs = [];
    }

    registerDialog(dialogData) {
        this.dialogs.push(dialogData);
    }

    getDialog(npcId, storyProgression, currentOrder = -1) {
        const availableDialogs = this.dialogs.filter(dialog =>
            dialog.npc_id === npcId &&
            dialog.story === storyProgression &&
            (currentOrder === -1 || dialog.order === currentOrder + 1) &&
            dialog.requirements()
        );
        return availableDialogs[0];
    }
}