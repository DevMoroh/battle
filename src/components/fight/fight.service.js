/**
 * class for fighting bot
 *
 */
export class Fight {

    constructor(shipService, init, toaster, $rootScope) {

        this.botTarget = {
            'coords':[],
            'status':false
        };
        this.shipService = shipService;
        this.init = init;
        this.toaster = toaster;
        this.$rootScope = $rootScope;
    }

    shootPlayer(X, Y) {
        let target = this.shipService.setBlocks('bot', X, Y, 'fire');
        if (target) {
            if (target.ship) {
                this.findTarget('bot', X, Y, target.type);
            }
            return target.ship;
        }

        return false;
    }

    shootBot() {
        var coords;
        if(this.botTarget['status']) {
            coords = this.att();
        }else{
            coords = this.fireRandom();
        }
        let { X, Y } = coords;
        let target = this.shipService.setBlocks('player', X, Y, 'fire');
        if (target) {
            let tr = this.findTarget('player', X, Y, target.type);
            if (target.ship) {
                if(tr.hit && !tr.kill) {
                    this.botTarget['status'] = true;
                    this.botTarget['coords'] = this.setTargets(X, Y);
                }else{
                    this.botTarget['status'] = (tr.kill) ? false : true;
                }
            }
        }
    }

    att() {
        let coords = this.botTarget['coords'].shift();

        if(coords && !this.shipService.revBlock('player', coords.X, coords.Y, 'fire')) {
            return this.att();
        }

        if(coords){
            return coords;
        }else{
            this.botTarget['status'] = false;
            return this.fireRandom();
        }
    }

    setTargets(X, Y) {
        return [
            {X:X, Y:Y + 1},
            {X:X, Y:Y - 1},
            {X:X - 1, Y:Y},
            {X:X + 1, Y:Y},
            {X:X - 1, Y:Y - 1},
            {X:X - 1, Y:Y + 1},
            {X:X + 1, Y:Y - 1},
            {X:X + 1, Y:Y + 1},
            {X:X - 2, Y:Y},
            {X:X + 2, Y:Y},
            {X:X, Y:Y - 2},
            {X:X, Y:Y + 2}
        ];
    }

    fireRandom () {
        let arr = this.shipService.matrixSea['player'];
        var RandElementX = Math.floor(Math.random() * (this.init.sizeArea - 1));
        var _arr = arr[RandElementX];
        var RandElementY = Math.floor(Math.random()*(_arr.length - 1));
        if(_arr[RandElementY].fire) {
            return this.fireRandom();
        }
        return {
            X:RandElementX,
            Y:RandElementY
        };
    }

    findTarget(typePl, X, Y, typeShip) {
        var name = (typePl == 'bot') ? 'Ты' : 'BOT',
            hit = false, kill = false,
            _self = this,
            targets = this.shipService.shipsCoords[typePl];

        if(!targets.length) { return ; }

        targets.forEach((item) => {
            if(item['type'] == typeShip && findCoords(item['coords'])) {
                _self.toaster.pop('warning', 'Ранение корабля!', `Ура ${name} попал в корабль!!!`);
                hit = true;
                item.hits = item.hits + 1;
                if(item.hits == typeShip) {
                    item.live = false;
                    kill = true;
                    _self.toaster.pop('error', 'Уничтожен корабль!', `${name} убил ${typeShip} палубный корабль!`);
                    if(targets.length == 0) {
                        _self.gameOver(name);
                    }
                    return ;
                }
            }
        });

        function findCoords(item) {
            var BreakException = {};
            try {
                item.forEach((it) => {
                    if (it.Y == Y && it.X == X) {
                        throw BreakException;
                    }
                })
            } catch (e) {
                if (e !== BreakException) throw e;
                return true;
            }
            return false;
        }

        return {
            hit:hit,
            kill:kill
        };
    }

    gameOver(name) {
        this.toaster.pop('error', 'GAME OVER', `${name} выиграл! Убиты все корабли, конец игры! ))`);
        this.shipService.resetBattle();
    }
}

