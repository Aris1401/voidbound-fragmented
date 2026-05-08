import DialogDB from "../../system/story/dialog/dialog_db";
import DialogFactory from "../../system/story/dialog/dialog_factory";

export default class MainDialogDB extends DialogDB {
    constructor() {
        super();

        // NPC 1
        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            -1,
            0,
            "Ca fait si longtemps..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            0,
            "Hé toi! Tu n'es pas d'ici, n'est-ce pas?"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            1,
            "Je suis parti dans ces forets afin de cueillir des herbes pour le village, mais j'ai été attaqué par des monstres et j'ai perdu tout ce que j'avais récolté."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            2,
            "Nous sommes déjà à court de ressources, et je ne peux pas me permettre de perdre plus de temps à chercher des herbes."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            3,
            "Si vous pouviez vous occuper d'eux pour moi, ce serait un grand secours !"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            4,
            "Je ne veux pas que cette partie de la forêt soit corrompue par l'influence de l'Obscurité, je vous en prie, débarrassez-vous de ces monstres !"
        ));
    }
}