import { manager, Scene } from "@tialops/maki";
import StorySystem from "../../system/story/story_system";

export default class DialogUI extends Scene {
  static TEXT_PADDING = 50;
  static DIALOG_VISIBLE_DURATION = 5000; // ms

  preload() {
    super.preload();
    manager.preload(this);

    this.dialogContainer = null;
    this.dialogBackground = null;
    this.dialogText = null;

    this.storySystem = null;

    this.dialogVisible = false;

    this.dialogTextAnimationPromise = null;
    this.dialogTimer = null;
  }

  init(data) {
    this.storySystem = data.storySystem;

    this.storySystem.storyEventEmitter.on(
      StorySystem.EVENTS.SHOW_DIALOG,
      (dialogData) => {
        if (!dialogData) return;

        this.showDialog(dialogData.content);
      },
    );

    this.storySystem.storyEventEmitter.on(
      StorySystem.EVENTS.HIDE_DIALOG,
      () => {
        this.hideDialog();
      },
    );
  }

  create() {
    super.create();
    manager.create(this);

    this.dialogBackground = this.add
      .rectangle(0, 0, 400, 100, 0x000000, 0.8)
      .setOrigin(0.5);
    this.dialogContainer = this.add.container(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 150,
      [this.dialogBackground],
    );
    this.dialogText = this.add
      .text(
        0,
        0,
        "This is a test text dfsdfdsf sfdfsdf fsfsdf sdfsdfsdf sdfsdfdsf sdfsdf ",
        { fontSize: "20px", fill: "#fff", wordWrap: { width: 460 } },
      )
      .setOrigin(0.5);

    this.dialogContainer.add(this.dialogText);

    this.hideDialog(true);
  }

  showDialog(text) {
    this.dialogText.setText(text);
    this.dialogContainer.setVisible(true);

    let supposedWidth = this.dialogText.displayWidth + DialogUI.TEXT_PADDING;
    let supposedHeight = this.dialogText.displayHeight + DialogUI.TEXT_PADDING;

    this.dialogContainer.setSize(supposedWidth, supposedHeight);
    this.dialogBackground.setSize(supposedWidth, supposedHeight);

    if (!this.dialogVisible) {
      let tween = this.tweens.add({
        targets: this.dialogContainer,
        alpha: { from: 0, to: 1 },
        y: {
          from: this.sys.canvas.height,
          to: this.sys.canvas.height - 150,
        },
        duration: 500,
        ease: "Power2",
      });
    }

    this.dialogTextAnimationPromise = this.animateText(this.dialogText);

    this.dialogVisible = true;
    if (this.dialogTimer != null) {
      this.dialogTimer.remove();
    }

    this.dialogTimer = this.time.addEvent({
      delay: DialogUI.DIALOG_VISIBLE_DURATION,
      callback: () => {
        this.hideDialog();
      },
    });
  }

  hideDialog(skipAnimation = false) {
	if (skipAnimation) {
		this.dialogContainer.setVisible(false);
        this.dialogVisible = false;

		return;
	}

    let tween = this.tweens.add({
      targets: this.dialogContainer,
      alpha: { from: 1, to: 0 },
      y: {
        from: this.sys.canvas.height - 150,
        to: this.sys.canvas.height,
      },
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        this.dialogContainer.setVisible(false);
        this.dialogVisible = false;
      },
    });
  }

  /**
   * Create typewriter animation for text
   * @param {Phaser.GameObjects.Text} target
   * @param {number} [speedInMs=25]
   * @returns {Promise<void>}
   * author: Joel Thoms - https://joel.net/creating-a-typewriter-effect-in-phaserjs-v3
   */
  animateText(target, speedInMs = 25) {
    // store original text
    const message = target.text;
    const invisibleMessage = message.replace(/[^ ]/g, " ");

    // clear text on screen
    target.text = "";

    // mutable state for visible text
    let visibleText = "";

    // use a Promise to wait for the animation to complete
    return new Promise((resolve) => {
      const timer = target.scene.time.addEvent({
        delay: speedInMs,
        loop: true,
        callback() {
          // if all characters are visible, stop the timer
          if (target.text === message) {
            timer.destroy();
            return resolve();
          }

          // add next character to visible text
          visibleText += message[visibleText.length];

          // right pad with invisibleText
          const invisibleText = invisibleMessage.substring(visibleText.length);

          // update text on screen
          target.text = visibleText + invisibleText;
        },
      });
    });
  }
}
