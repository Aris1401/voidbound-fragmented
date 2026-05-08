import Entity from "../entity";

export default class BaseEnemy extends Entity {
    constructor(scene, name) {
        super(scene, name);
    }

    onOverlapWithBody(body) {
        console.log("HAHAHAHAHAHAHAHHAHAHA")
    }
}