
/* libs */
import Angular from 'angular';
import Toaster from 'angularjs-toaster';
import Animate from 'angular-animate';
import 'angularjs-toaster/toaster.css';

/* components */
import appConstants from './app.constants';
import BattleArea from './components/battle-area/battle-area.component';

/* styles */
import './app.css';

Angular.module('app', [
    BattleArea.name,
    appConstants.name,
    Toaster,
    Animate
]);

Angular.element(document).ready(function() {
    Angular.bootstrap(document.body, ['app']);
});