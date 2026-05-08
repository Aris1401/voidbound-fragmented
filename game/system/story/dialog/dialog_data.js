export default class DialogData {
    constructor() {
        this.id = "";
        this.story = -1;
        this.order = 0;
        this.content = "";
        this.npc_id = "";
        this.requirements = () => true; // Default to always true
    }
}