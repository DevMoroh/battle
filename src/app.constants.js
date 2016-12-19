
import Angular from 'angular';

export default Angular.module('appConstants', [])
    .constant('init', {
        sizeArea:20,
        shipsConf:{
            'one':{ count:5, volume:1},
            'two':{ count:4, volume:2},
            'three':{ count:3, volume:3},
            'four':{ count:2, volume:4}
        }
    })