import { Scene, manager } from '@tialops/maki'
import BaseNPC from '../entities/npc/base_npc'
import InteractionSystem from '../system/interaction/interaction_system'
import DialogUI from './HUD/dialog_ui'
import MainDialogDB from '../data/dialog/main_dialog_db'
import StoryState from '../system/story/story_state'
import StorySystem from '../system/story/story_system'

export default class GameScene extends Scene {
    preload() {
        super.preload()
        this.lia = this.maki.player('lia')
        manager.map(this, 'realm_starting_area')
        manager.preload(this)
    }

    create() {
        super.create()
        manager.create(this)

        // Managing the story
        var mainDialogDB = new MainDialogDB();
        var storyState = new StoryState();
        this.storySystem = new StorySystem(this, storyState, mainDialogDB);
        
        // Creating the game camera
        this.cameras.main.setBounds(0, 0, 100*32, 100*32) // Assuming the map is 100x100 tiles of 32px each
        this.cameras.main.startFollow(this.lia.sprite)
        
        // Place lia in the center of the map (50×50 tiles × 16px = 800×800)
        this.lia.sprite.setPosition(391, 975)

        this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'default_map'))
        
        // Creating the interaction system
        this.interactionSystem = new InteractionSystem(this, this.lia.sprite);

        // Creating the npc group
        this.npcs = this.physics.add.group()

        var npc = new BaseNPC(this, 'lia', 'npc_1', this.storySystem);
        npc.setPosition(655, 1025);
        npc.setSize(32, 64);
        npc.create();
        
        this.npcs.add(npc);

        // Launching the dialog UI
        this.scene.add('dialog_ui', DialogUI, false);
        this.scene.launch('dialog_ui', { storySystem: this.storySystem });
    }

    update() {
        this.interactionSystem.update()
        this.maki.move(this.lia)

        // Debug get the player position when pressing T
        this.input.keyboard.on('keydown-T', () => {
            console.log(`Player position: x=${this.lia.sprite.x}, y=${this.lia.sprite.y}`)
        })
    }
}
