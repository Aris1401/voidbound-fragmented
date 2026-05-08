import DialogData from "./dialog_data";

export default class DialogFactory {
    static createDialog(npcId, storyProgression, order, content, requirements = () => true) {
        let dialog = new DialogData();
        dialog.id = `${npcId}_${storyProgression}_${order}`;
        dialog.npc_id = npcId;
        dialog.story = storyProgression;
        dialog.order = order;
        dialog.content = content;
        dialog.requirements = requirements;

        return dialog;
    }
}