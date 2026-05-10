import DialogDB from "../../system/story/dialog/dialog_db";
import DialogFactory from "../../system/story/dialog/dialog_factory";
import HealCard from "../combat/card/heal_card";
import SlashCard from "../combat/card/slash_card";

export default class MainDialogDB extends DialogDB {
    constructor(playerStats, cardDB) {
        super();

        // NPC 1
        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            -1,
            0,
            "Cela fait si longtemps déjà..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            0,
            "Hé, toi ! Tu n'es pas d'ici, n'est-ce pas ?"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            1,
            "Je m'étais aventuré dans ces forêts pour cueillir des herbes pour le village... mais des monstres m'ont tendu une embuscade. J'ai tout perdu."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            2,
            "Nous manquons déjà cruellement de ressources. Chaque heure perdue nous rapproche du pire."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            3,
            "Si tu pouvais t'occuper de ces créatures à ma place... tu nous sauverais la mise."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            4,
            "Je refuse de voir cette partie de la forêt tomber sous l'emprise de l'Obscurité. Je t'en supplie, débarrasse-nous de ces monstres !"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            5,
            "Tiens, prends ceci ! Ces lames et ce baume te seront précieux là où tu vas.",
            () => { return true },
            () => {
                playerStats.deck.push(new (cardDB.get(SlashCard))())
                playerStats.deck.push(new (cardDB.get(SlashCard))())
                playerStats.deck.push(new (cardDB.get(SlashCard))())
                playerStats.deck.push(new (cardDB.get(HealCard))())
            }
        ))

        // ========================== NPC 2 ==================================
        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            -1,
            0,
            "Une éternité que je n'ai pas vu un nouveau visage par ici..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            0,
            "Hé ! Je t'ai vu les mettre en déroute ! Ces créatures étaient coriaces, tu sais... On les appelle les Défectueux de l'Obscurité."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            1,
            "Tu débarques à peine, c'est évident. Va trouver l'Ancien , lui seul peut t'expliquer comment tu as atterri ici, et ce que sont vraiment ces monstres."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            2,
            "Suis le chemin tout droit vers le bas. Tu ne peux pas le manquer."
        ));

        // ============================= Elder ===============================
        this.registerDialog(DialogFactory.createDialog(
            "elder",
            -1,
            0,
            "Va... et accomplis ta destinée."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            0,
            "Ah... tu es enfin là. Les nouvelles vont vite dans ce petit village. Je t'attendais."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            1,
            "Tu dois être le nouveau arrivant. Et je gage que des milliers de questions se bousculent en toi en ce moment même."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            2,
            "Alors laisse-moi commencer depuis le commencement. Tout ce qui existe , chaque pierre, chaque souffle, chaque étoile , est l'œuvre d'anciens dieux..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            3,
            "Mais un jour, sans crier gare, ces dieux ont disparu. Comme si le monde avait retenu son souffle... et qu'il n'avait jamais expiré."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            4,
            "Cet événement, nous l'appelons le \"Grand Silence\". Et dans ce silence, l'ordre fragile qu'ils maintenaient s'est effondré... éveillant ainsi son exact opposé."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            5,
            "...L'Obscurité."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            6,
            "Étant l'antithèse même de la création, et ne connaissant que la destruction, elle a tenté à sa façon de restaurer l'ordre... en imitant maladroitement la notion de création."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            7,
            "Elle arrache des fragments dans le tissu même de la réalité , ce que nous appelons les \"Entrelacements\" , pour forger ses propres mondes."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            8,
            "Mais sans véritable compréhension, elle n'enfante que des réalités bancales, des mondes qui tiennent à un fil..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            9,
            "Ces \"Créations\" sont imparfaites. Souvent instables. Parfois même profondément destructrices."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            10,
            "Les monstres que tu as combattus sont nés de cette imperfection. Des êtres façonnés par l'Obscurité, mais brisés dès leur conception."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            11,
            "Ce monde... cette réalité où tu viens d'atterrir... est l'une de ces Créations. Un monde imparfait, cousu à la hâte par des mains qui ne savent pas créer."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            12,
            "Nous tous, dans ce village, avons atterri ici il y a bien longtemps. Nous cherchons tous la même chose, un moyen de partir."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            13,
            "Il est dit que le seul moyen de quitter une telle réalité est de rassembler ses \"Encres\" , les essences même qui la composent et la maintiennent en vie."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            14,
            "Dans ce monde, ces Encres sont gardées par des créatures d'une puissance redoutable. Aucun d'entre nous n'a pu les approcher."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            15,
            "Mais en apprenant ton arrivée... j'ai senti quelque chose que je n'avais plus ressenti depuis longtemps. L'espoir. Tu es peut-être celui , ou celle , que nous attendions."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            16,
            "Les gardiens des Encres sont des Gobelins. Ils se terrent aux carrefours des chemins qui mènent hors d'ici, veillant jalousement sur ce qui nous est nécessaire."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            17,
            "Je ne te demande pas cela à la légère. Mais je t'en prie... aide-nous à rentrer chez nous."
        ));
    }
}