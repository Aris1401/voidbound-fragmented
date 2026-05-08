export default class StoryState {
    constructor() {
        this.progression = 0;
        this.dialogState = {};
    }

    progressStory() {
        this.progression++;
    }

    setDialogState(npcId, storyPoint, currentOrder) {
        if (!this.dialogState[npcId]) {
            this.dialogState[npcId] = {};
        }

        this.dialogState[npcId][storyPoint] = currentOrder;
    }
}