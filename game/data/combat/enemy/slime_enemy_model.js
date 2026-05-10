import EnemyModel from "../../../system/combat/enemy/enemy_model";
import EnemyView from "../../../system/combat/enemy/enemy_view";
import DamageEffect from "../effect/damage_effect";

export default class SlimeEnemyModel extends EnemyModel {
    constructor() {
        super();

        this.id = "slime";
        this.name = "Slime";
        this.maxHP = 20;
        this.minHP = 10;
        this.maxBlock = 0;

        this.damage = 5;
    }

    executeMove(playerStats) {
        return (enemyView) => {
            return new Promise(resolve => {
                let originalPosition = enemyView.x

                var chain = enemyView.scene.tweens.chain({
                    targets: enemyView,
                    tweens: [
                        {
                            x: originalPosition - 100,
                            ease: 'Power1',
                            duration: 150,
                        },
                        {
                            x: originalPosition,
                            ease: 'Power1',
                            duration: 250,
                        }
                    ],
                    onComplete: () => {
                    let damageEffect = new DamageEffect(this.damage);
                        playerStats.effectSystem.process(damageEffect)

                        resolve()
                    }
                })
            })
        }
    }  
}