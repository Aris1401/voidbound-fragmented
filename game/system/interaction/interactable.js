export default class Interactable {
    constructor(scene, name, onInteractCallback = null, onEnableCallback = null, onDisableCallback = null) {
        this.scene = scene;
        this.name = name;
        this.onInteractCallback = onInteractCallback;
        this.onEnableCallback = onEnableCallback;
        this.onDisableCallback = onDisableCallback;
    }
}