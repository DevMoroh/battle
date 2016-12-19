
// import Angular from 'angular';

class BattleArea {

    constructor(init) {
        this.Y = 0;
        this.X = 0;
        this.matrixSea = { bot: [], player: []};
        this.init = init;
        this.shipsCoords = [];

        this.initGame();
    }


    initGame() {

        for(let x=0; x < this.init.sizeArea; x++) {
            this.matrixSea.player[x] = [];
            this.matrixSea.bot[x] = [];
            for(let y=0; y < this.init.sizeArea; y++) {
                this.matrixSea.player[x][y] = {
                    ship:false,
                    block:false,
                    fire:false
                };
                this.matrixSea.bot[x][y] = {
                    ship:false,
                    block:false,
                    fire:false
                };
            }
        }
    }

    /**
     * Generate random coords
     * @param max
     * @returns {{Y: number, X: number}}
     */
    randomInitArea(max, ship, type) {
        let arr = this.matrixSea[type];
        var RandElementX = Math.floor(Math.random() * max);
        var _arr = arr[RandElementX];
        var RandElementY = Math.floor(Math.random()*(_arr.length - 1));

        let arrShip = this.renderShip(ship, RandElementX, RandElementY, type);

        if (!arrShip) {
            console.info('restart find!');
            return this.randomInitArea(max, ship, type);
        } else {
            return arrShip;
        }
    }


    setBlocks(arr, X, Y, key, value) {
        if(this.revBlock(arr, X, Y, key)) {
            let val = (value) ? value : true;
            this.matrixSea[arr][X][Y][key] = val;
            return this.matrixSea[arr][X][Y];
        }
    }

    revBlock(arr, X, Y, key) {
        if(this.matrixSea[arr][X]) {
            if(this.matrixSea[arr][X][Y]) {
                return !this.matrixSea[arr][X][Y][key];
            }
        }
        return false;
    }

    /**
     *  set blocks around the ship
     * @param arr
     * @param coords
     */
    setBorder (type, coords) {
        let {X, Y} = coords;
        this.setBlocks(type, X, Y + 1, 'block');
        this.setBlocks(type, X, coords.Y - 1, 'block');

        this.setBlocks(type, X - 1, Y, 'block');
        this.setBlocks(type, X + 1, Y, 'block');

        this.setBlocks(type, X, Y - 1, 'block');
        this.setBlocks(type, X, Y + 1, 'block');

        this.setBlocks(type, X - 1, Y - 1, 'block');
        this.setBlocks(type, X - 1, Y + 1, 'block');

        this.setBlocks(type, X + 1, Y - 1, 'block');
        this.setBlocks(type, X + 1, Y + 1, 'block');
    }

    resetBattle() {
        this.shipsCoords = [];
        this.initGame();
    }
}

export class Ship extends BattleArea {

    constructor(init) {
        super(init);
    }

    setupBattle(type) {

        let _sc = this.init.shipsConf;
        for(let ship in _sc) {
            for(let _f = 1; _f <= _sc[ship].count; _f++) {
                this.setShips(_sc[ship].volume, type);
            }
        }
    }

    initBattle() {

        this.setupBattle('player');
        this.setupBattle('bot');

        return this.matrixSea;
    }

    setShips(ship, type) {
        var arrShip = this.randomInitArea((this.init.sizeArea-1), ship, type);

        this.initShips(type, ship, arrShip);
    }

    initShips(type, typeShip, arrShip) {

        if(arrShip && arrShip.length) {
            for (let r = 0; r < arrShip.length; r++) {
                let {X, Y} = arrShip[r];
                this.setBlocks(type, X, Y, 'ship');
                this.setBlocks(type, X, Y, 'block');
                this.setBlocks(type, X, Y, 'type', typeShip);
                this.setBorder(type, {X, Y});
            }
            if(!this.shipsCoords[type]) {  this.shipsCoords[type] = []; }
            this.shipsCoords[type].push({type:typeShip, coords:arrShip, hits:0, live:true });
            return ;
        }
        return typeShip;
    }

    renderShip(shipLen, X, Y, type) {
        let way = ['top', 'left', 'right', 'bottom'],
            _ship = {},
            _self = this;
        way.forEach((item)=>{
            _ship[item] = {coords: [{X:X, Y:Y}]};
        });

        if(shipLen == 1) return (this.revBlock(type, X, Y, 'block')) ? [{X:X, Y:Y}] : false;

        for(let y = 0; y < way.length; y++) {
            var _w = way[y],
                _X = X,
                _Y = Y;
            for (let i = 1; i < shipLen; i++) {
                switch (_w) {
                    case 'top':
                             _X++;
                            setCoords(_ship, _w, i, _X, _Y);
                        break;
                    case 'bottom':
                             _X--;
                            setCoords(_ship, _w, i, _X, _Y);
                        break;
                    case 'right':
                            _Y++;
                            setCoords(_ship, _w, i, _X, _Y);
                        break;
                    case 'left':
                            _Y--;
                            setCoords(_ship, _w, i, _X, _Y);
                        break;
                }
            }
            if(_ship[_w] && _ship[_w]['coords'].length == shipLen){
                return _ship[_w]['coords'];
            }
        }

        function setCoords (_ship, key, index, X, Y) {
            var bl = _self.revBlock(type, X, Y, 'block');

              var _e = bl && _self.revBlock(type, X-1, Y+1, 'block')
                && _self.revBlock(type, X-1, Y-1, 'block')
                && _self.revBlock(type, X+1, Y+1, 'block')
                && _self.revBlock(type, X+1, Y-1, 'block');
            if (_e) {
                _ship[key]['coords'].push({X:X, Y:Y});
            }
        }

    }

   static getIns(init){
       return new Ship(init);
   }

}

Ship.getIns.$inject = ['init'];


