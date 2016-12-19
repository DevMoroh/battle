
import Angular from 'angular';
import { Ship } from './battleground.service';
import { Fight } from '../fight/fight.service';
// import _ from 'lodash';

class Battleground {
    constructor(init, shipService, fightService, toaster) {
        console.info('battleground component');
        this.init = init;
        this.shipService = shipService;
        this.fightService = fightService;
        this.toaster = toaster;

        this.statusGame = false;
        this.ships = {
            bot:[],
            player:[]
        };
    }

    $onInit() {

       //this.setBattle();
    }

    setBattle() {

        this.shipService.initBattle();
        this.statusGame = true;

        console.log(this.shipService.shipsCoords);
        console.log(this.ships);
    }

    resetBattle() {
        this.shipService.resetBattle();
        this.statusGame = false;
    }

    shootPlayer(X, Y, tr) {
        if(!tr.fire) {
            this.fightService.shootPlayer(X, Y);
            this.fightService.shootBot();
        }else{
            this.toaster.pop('info', 'Битая ячейка!', 'Попробуй другую!');
        }
    }

    get _matrixSea() {
        return this.shipService.matrixSea;
    }

    get ships() {
        return this.shipService.shipsCoords;
    }

    set ships(ships) {
        this.shipService.shipsCoords = ships;
    }
}



export default Angular.module('battleground', [])
    .service('shipService', Ship.getIns)
    .service('fightService', Fight)
    .component('battleground',{
        controller:Battleground,
        template:require('./battleground.html')
    })