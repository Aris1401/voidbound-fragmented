import { Scene, manager } from '@tialops/maki'
import BaseNPC from '../entities/npc/base_npc'
import InteractionSystem from '../system/interaction/interaction_system'
import DialogUI from './HUD/dialog_ui'
import MainDialogDB from '../data/dialog/main_dialog_db'
import StoryState from '../system/story/story_state'
import StorySystem from '../system/story/story_system'
import DialogFactory from '../system/story/dialog/dialog_factory'
import BaseEnemy from '../entities/enemy/base_enemy'
import CombatScene from './CombatScene'
import CombatSystem from '../system/combat/combat_system'
import PlayerStats from '../data/combat/stats/player/player_stats'
import SlashCard from '../data/combat/card/slash_card'
import MainCardDB from '../data/combat/db/main_card_db'

import SlimeEnemy from "../data/entities/enemies/slime_enemy"
import HealCard from '../data/combat/card/heal_card'
import GoblinEnemy from '../data/entities/enemies/goblin_enemy'

export default class GameScene extends Scene {
    preload() {
        super.preload()
        this.lia = this.maki.player('lia')
        manager.map(this, 'realm_starting_area')
        manager.preload(this)

        this.load.image('slime', 'enemy/slime.png')
        this.load.image('goblin', 'enemy/goblin.png')
    }

    create() {
        super.create()
        manager.create(this)

        // Managing the story
        var mainDialogDB = new MainDialogDB();
        var storyState = new StoryState();
        this.storySystem = new StorySystem(this, storyState, mainDialogDB);

        // Main card db
        this.mainCardDB = new MainCardDB()
        
        // Creating the game camera
        this.cameras.main.setBounds(0, 0, 100*32, 100*32) // Assuming the map is 100x100 tiles of 32px each
        this.cameras.main.startFollow(this.lia.sprite)
        
        // Creating the player stats
        this.playerStats = new PlayerStats();
        this.playerStats.maxHp = 200
        this.playerStats.hp = this.playerStats.maxHp

        // Mockup
        this.playerStats.deck.push(new (this.mainCardDB.get(SlashCard))())
        this.playerStats.deck.push(new (this.mainCardDB.get(SlashCard))())
        this.playerStats.deck.push(new (this.mainCardDB.get(SlashCard))())
        this.playerStats.deck.push(new (this.mainCardDB.get(HealCard))())

        // Creation of the combat system
        this.combatSystem = new CombatSystem();
        this.combatSystem.setPlayerStats(this.playerStats)
        this.combatSystem.cardDB = this.mainCardDB

        // Place lia in the center of the map (50×50 tiles × 16px = 800×800)
        this.lia.sprite.setPosition(391, 975)

        this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'default_map'))
        
        // Creating the interaction system
        this.interactionSystem = new InteractionSystem(this, this.lia.sprite);

        this.createNPCs();
        this.createEnemies();

        // Launching the dialog UI
        if (!this.scene.get('dialog_ui')) this.scene.add('dialog_ui', DialogUI, false);
        if (!this.scene.get('combat')) this.scene.add('combat', CombatScene)
        this.scene.launch('dialog_ui', { storySystem: this.storySystem });
    }

    createNPCs() {
        // Creating the npc group
        this.npcs = this.physics.add.group()

        var npc = new BaseNPC(this, 'lia', 'npc_1', this.storySystem);
        npc.setPosition(655, 1025);
        npc.setSize(32, 64);
        npc.create();
        
        this.npcs.add(npc);
    }

    createEnemies() {
        this.enemies = this.physics.add.group();

        let enemy = new SlimeEnemy(this, this.combatSystem);
        enemy.setPosition(961, 983)
        enemy.create()
        this.enemies.add(enemy);

        let enemy2 = new SlimeEnemy(this, this.combatSystem);
        enemy2.setPosition(1497, 1020)
        enemy2.create()
        this.enemies.add(enemy2);

        let boss1 = new GoblinEnemy(this, this.combatSystem);
        boss1.setPosition(2012, 292)
        boss1.create()
        this.enemies.add(boss1);

        let boss2 = new GoblinEnemy(this, this.combatSystem);
        boss2.setPosition(2702, 1591)
        boss2.create()
        this.enemies.add(boss2);

        let boss3 = new GoblinEnemy(this, this.combatSystem);
        boss3.setPosition(391, 2828)
        boss3.create()
        this.enemies.add(boss3);

        this.physics.add.overlap(this.lia.sprite, this.enemies, function (player, enemy) {
            enemy.onOverlapWithBody(player)
        })
    }

    update() {
        this.interactionSystem.update()
        this.maki.move(this.lia)

        // Debug get the player position when pressing T
        this.input.keyboard.on('keydown-T', () => {
            this.storySystem.storyEventEmitter.emit(StorySystem.EVENTS.SHOW_DIALOG, DialogFactory.createDialog("-1", -1, -1, `Player position: x=${this.lia.sprite.x}, y=${this.lia.sprite.y}`));
        })
    }
}
