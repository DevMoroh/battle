import Angular from 'angular';
import Battleground from '../battleground/battleground.component';

class Battle {
    constructor() {
        console.info('battle component');
    }



}

export default Angular.module('battle-area', [
    Battleground.name
]).component('battleArea', {
    transclude:true,
    controller:Battle,
    template:require('./battle-area.html')
});