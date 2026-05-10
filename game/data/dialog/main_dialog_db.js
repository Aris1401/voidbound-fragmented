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
            "It has already been so long..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            0,
            "Hey, you! You're not from around here, are you?"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            1,
            "I ventured into these forests to gather herbs for the village... but monsters ambushed me. I lost everything."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            2,
            "We are already desperately lacking resources. Every hour lost brings us closer to disaster."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            3,
            "If you could deal with those creatures for me... you'd be saving us."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            4,
            "I refuse to watch this part of the forest fall under the Void' grasp. I beg you, rid us of those monsters!"
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_1",
            0,
            5,
            "Here, take this! These blades and this balm will be invaluable where you're going.",
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
            "It's been an eternity since I've seen a new face around here..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            0,
            "Hey! I saw you drive them back! Those creatures were tough, you know... We call them the Defectives of the Void."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            1,
            "You just arrived, that's obvious. Go see the Elder, only he can explain how you ended up here, and what those monsters truly are."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "npc_2",
            0,
            2,
            "Follow the path straight downward. You can't miss it."
        ));

        // ============================= Elder ===============================
        this.registerDialog(DialogFactory.createDialog(
            "elder",
            -1,
            0,
            "Go... and fulfill your destiny."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            0,
            "Ah... so you've finally arrived. News travels fast in this small village. I have been expecting you."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            1,
            "You must be the newcomer. And I wager thousands of questions are racing through your mind right now."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            2,
            "Then let me begin from the very beginning. Everything that exists , every stone, every breath, every star , was the work of ancient gods..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            3,
            "But one day, without warning, those gods vanished. As if the world itself had held its breath... and never exhaled again."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            4,
            "We call this event the \"Great Silence\". And within that silence, the fragile order they maintained collapsed... awakening its very opposite."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            5,
            "...The Void."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            6,
            "Being the very antithesis of creation, and knowing only destruction, it tried in its own way to restore order... by clumsily imitating the concept of creation."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            7,
            "It tears fragments from the very fabric of reality , what we call the \"Interweavings\" , to forge worlds of its own."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            8,
            "But without true understanding, it gives birth only to flawed realities, worlds hanging by a thread..."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            9,
            "These \"Creations\" are imperfect. Often unstable. Sometimes deeply destructive."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            10,
            "The monsters you fought were born from this imperfection. Beings shaped by the Void, yet broken from the very moment of their creation."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            11,
            "This world... this reality you have just fallen into... is one of those Creations. An imperfect world, hastily stitched together by hands that do not know how to create."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            12,
            "All of us in this village arrived here long ago. We all seek the same thing, a way to leave."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            13,
            "It is said that the only way to escape such a reality is to gather its \"Anchor\" , the very essences that compose and sustain it."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            14,
            "In this world, those Anchors are guarded by creatures of terrifying power. None of us have been able to approach them."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            15,
            "But upon hearing of your arrival... I felt something I had not felt in a very long time. Hope. You may be the one , we have been waiting for."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            16,
            "The guardians of the Anchors are Goblins. They lurk at the crossroads leading out of this place, jealously guarding what we need."
        ));

        this.registerDialog(DialogFactory.createDialog(
            "elder",
            0,
            17,
            "I do not ask this lightly. But please... help us return home."
        ));
    }
}