import ControlSchemes from "../../controls_schemes";

export default class InteractionSystem {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.enabledInteractables = new Set();

        this.interactionKey = this.scene.input.keyboard.addKey(ControlSchemes.INTERACTION_KEY);
        this.isInteracting = false;
    }

    update() {
        this.updateInteractables();
        this.updateInputs();
    }

    updateInputs() {
        if (this.interactionKey.isDown && !this.isInteracting) {
            this.enabledInteractables.forEach(interactable => {
                if (interactable.gameObject.interactable.onInteractCallback) {
                    interactable.gameObject.interactable.onInteractCallback();
                }
            });

            this.isInteracting = true;
        }

        if (this.interactionKey.isUp && this.isInteracting) {
            this.isInteracting = false;
        }
    }

    updateInteractables() {
        var bodies = this.scene.physics.overlapCirc(this.player.x, this.player.y, 100, true, true);

        this.enabledInteractables.forEach(interactable => {
            if (!bodies.includes(interactable)) {
                this.enabledInteractables.delete(interactable);
                if (interactable.gameObject.interactable.onDisableCallback) {
                    interactable.gameObject.interactable.onDisableCallback();
                }
            }
        });

        bodies.forEach(body => {
            if (this.enabledInteractables.has(body)) {
                return;
            }

            if (Object.hasOwn(body.gameObject, 'interactable')) {
                this.enabledInteractables.add(body);
                if (body.gameObject.interactable.onEnableCallback) {
                    body.gameObject.interactable.onEnableCallback();
                }
            }
        });
    }
}