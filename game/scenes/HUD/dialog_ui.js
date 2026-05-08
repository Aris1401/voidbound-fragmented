import { manager, Scene } from "@tialops/maki"
import StorySystem from "../../system/story/story_system";

export default class DialogUI extends Scene {
    static TEXT_PADDING = 50;

    preload() {
        super.preload()
        manager.preload(this)

        this.dialogContainer = null;
        this.dialogBackground = null;
        this.dialogText = null;

        this.storySystem = null;
    }

    init(data) {
        this.storySystem = data.storySystem;

        this.storySystem.storyEventEmitter.on(StorySystem.EVENTS.SHOW_DIALOG, (dialogData) => {
            if (!dialogData) return;

            this.showDialog(dialogData.content);
        })

        this.storySystem.storyEventEmitter.on(StorySystem.EVENTS.HIDE_DIALOG, () => {
            this.hideDialog();
        })
    }

    create() {
        super.create()
        manager.create(this)

        this.dialogBackground = this.add.rectangle(0, 0, 400, 100, 0x000000, 0.8).setOrigin(0.5);
        this.dialogContainer = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height - 150, [this.dialogBackground]);
        this.dialogText = this.add.text(0, 0, 'This is a test text dfsdfdsf sfdfsdf fsfsdf sdfsdfsdf sdfsdfdsf sdfsdf ', { fontSize: '20px', fill: '#fff', wordWrap: { width: 460 } }).setOrigin(0.5);

        this.dialogContainer.add(this.dialogText);

        this.hideDialog();
    }

    showDialog(text) {
        this.dialogText.setText(text);
        this.dialogContainer.setVisible(true);

        let supposedWidth = this.dialogText.displayWidth + DialogUI.TEXT_PADDING;
        let supposedHeight = this.dialogText.displayHeight + DialogUI.TEXT_PADDING;

        this.dialogContainer.setSize(supposedWidth, supposedHeight);
        this.dialogBackground.setSize(supposedWidth, supposedHeight);
    }

    hideDialog() {
        this.dialogContainer.setVisible(false);
    }
}